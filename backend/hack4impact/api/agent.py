import asyncio
import time

from typing import Dict

from pydantic import BaseModel

from mcp_agent.agents.agent import Agent
from mcp_agent.app import MCPApp
# from mcp_agent.workflows.llm.augmented_llm_google import GoogleAugmentedLLM
from mcp_agent.workflows.llm.augmented_llm_openai import OpenAIAugmentedLLM

from prompt import PROMPT

app = MCPApp(
    name="mcp_basic_agent"
)


class Result(BaseModel):
    sections: Dict


async def example_usage():
    async with app.run() as agent_app:
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
                message="""Scan contents of directory and generate according to your instructions.""",
                response_model=Result
            )
            logger.info(f"Result: {result}")


def main():
    start = time.time()
    asyncio.run(example_usage())
    end = time.time()
    t = end - start

    print(f"Total run time: {t:.2f}s")


if __name__ == "__main__":
    main()
