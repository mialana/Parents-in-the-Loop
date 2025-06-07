import asyncio
import time

from typing import Dict

from pydantic import BaseModel

from mcp_agent.agents.agent import Agent
from mcp_agent.app import MCPApp
from mcp_agent.config import (
    Settings,
    LoggerSettings,
    MCPSettings,
    MCPServerSettings,
    OpenAISettings,
)

# from mcp_agent.workflows.llm.augmented_llm_google import GoogleAugmentedLLM
from mcp_agent.workflows.llm.augmented_llm_openai import OpenAIAugmentedLLM

from ..settings import OPENAI_KEY
from .prompt import PROMPT


class Result(BaseModel):
    sections: Dict


async def query(filepath: str, message: str):
    print(filepath)
    print(message)
    settings = Settings(
        execution_engine="asyncio",
        logger=LoggerSettings(type="file", level="info"),
        mcp=MCPSettings(
            servers={
                "filesystem": MCPServerSettings(
                    command="npx",
                    args=["-y", "@modelcontextprotocol/server-filesystem", filepath],
                ),
            }
        ),
        openai=OpenAISettings(
            api_key=OPENAI_KEY,
            default_model="gpt-4o-mini",
        ),
    )

    app = MCPApp(name="mcp_basic_agent", settings=settings)

    async with app.run() as agent_app:
        print(agent_app.context)
        logger = agent_app.logger
        context = agent_app.context

        logger.info("Current config:", data=context.config.model_dump())

        finder_agent = Agent(
            name="finder",
            instruction=PROMPT,
            server_names=["filesystem"],
        )

        async with finder_agent:
            logger.info("finder: Connected to server, calling list_tools...")
            result = await finder_agent.list_tools()
            logger.info("Tools available:", data=result.model_dump())

            # llm = await finder_agent.attach_llm(GoogleAugmentedLLM)
            llm = await finder_agent.attach_llm(OpenAIAugmentedLLM)

            result = await llm.generate_structured(
                message=message, response_model=Result
            )
            logger.info(f"Result: {result}")
            return result

if __name__ == "__main__":
    start = time.time()
    asyncio.run(query())
    end = time.time()
    t = end - start

    print(f"Total run time: {t:.2f}s")
