import base64
import os
from typing import Optional
import anthropic
import openai

class LLMService:
    def __init__(self):
        self.anthropic_client = None
        self.openai_client = None
        
        # Initialize Anthropic client if API key exists
        anthropic_key = os.getenv('ANTHROPIC_API_KEY')
        if anthropic_key:
            self.anthropic_client = anthropic.Anthropic(api_key=anthropic_key)
        
        # Initialize OpenAI client if API key exists
        openai_key = os.getenv('OPENAI_API_KEY')
        if openai_key:
            try:
                # Try new OpenAI client format first
                self.openai_client = openai.OpenAI(api_key=openai_key)
            except AttributeError:
                # Fall back to older OpenAI client format
                openai.api_key = openai_key
                self.openai_client = openai
    
    def analyze_homework_image(self, image_path: str) -> str:
        """
        Analyze homework image and provide feedback using available LLM service
        """
        try:
            # Try Anthropic first
            if self.anthropic_client:
                return self._analyze_with_anthropic(image_path)
            # Fall back to OpenAI
            elif self.openai_client:
                return self._analyze_with_openai(image_path)
            else:
                return self._generate_mock_feedback(image_path)
        except Exception as e:
            print(f"Error analyzing image: {e}")
            return self._generate_mock_feedback(image_path)
    
    def _analyze_with_anthropic(self, image_path: str) -> str:
        """Analyze image using Anthropic Claude"""
        with open(image_path, 'rb') as image_file:
            image_data = base64.b64encode(image_file.read()).decode('utf-8')
        
        message = self.anthropic_client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=1000,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": image_data
                            }
                        },
                        {
                            "type": "text",
                            "text": """Please analyze this homework image and provide helpful feedback. Consider:

1. Subject and grade level assessment
2. Correctness of answers (if visible)
3. Areas for improvement
4. Positive reinforcement
5. Next steps or study suggestions

Format your response with clear sections and be encouraging while providing constructive feedback."""
                        }
                    ]
                }
            ]
        )
        return message.content[0].text
    
    def _analyze_with_openai(self, image_path: str) -> str:
        """Analyze image using OpenAI GPT-4 Vision"""
        with open(image_path, 'rb') as image_file:
            image_data = base64.b64encode(image_file.read()).decode('utf-8')
        
        try:
            # Try new OpenAI client format
            response = self.openai_client.chat.completions.create(
                model="gpt-4-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": """Please analyze this homework image and provide helpful feedback. Consider:

1. Subject and grade level assessment
2. Correctness of answers (if visible)
3. Areas for improvement
4. Positive reinforcement
5. Next steps or study suggestions

Format your response with clear sections and be encouraging while providing constructive feedback."""
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_data}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=1000
            )
            return response.choices[0].message.content
        except AttributeError:
            # Fall back to older OpenAI format
            response = self.openai_client.ChatCompletion.create(
                model="gpt-4-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": """Please analyze this homework image and provide helpful feedback. Consider:

1. Subject and grade level assessment
2. Correctness of answers (if visible)
3. Areas for improvement
4. Positive reinforcement
5. Next steps or study suggestions

Format your response with clear sections and be encouraging while providing constructive feedback."""
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_data}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=1000
            )
            return response.choices[0].message.content
    
    def chat_with_ai(self, message: str, conversation_history: Optional[list] = None) -> str:
        """
        Send a chat message to the AI and get a response
        """
        try:
            # Try Anthropic first
            if self.anthropic_client:
                return self._chat_with_anthropic(message, conversation_history)
            # Fall back to OpenAI
            elif self.openai_client:
                return self._chat_with_openai(message, conversation_history)
            else:
                return self._generate_mock_chat_response(message)
        except Exception as e:
            print(f"Error in chat: {e}")
            return self._generate_mock_chat_response(message)
    
    def _chat_with_anthropic(self, message: str, conversation_history: Optional[list] = None) -> str:
        """Chat using Anthropic Claude"""
        system_prompt = """You are a helpful AI assistant for the "Parent in the Loop" platform. You help parents understand their child's school documents, navigate educational processes, and advocate for their children. 

Key guidelines:
- Use simple, clear language that's easy to understand
- Be supportive and encouraging to parents
- Focus on practical, actionable advice
- Help parents understand their rights and options
- If discussing school documents or processes, explain them in plain terms
- Always be respectful of different family backgrounds and circumstances"""
        
        messages = []
        
        # Add conversation history if provided
        if conversation_history:
            for chat_msg in conversation_history:
                messages.append({
                    "role": "user" if chat_msg["type"] == "user" else "assistant",
                    "content": chat_msg["content"]
                })
        
        # Add current message
        messages.append({
            "role": "user",
            "content": message
        })
        
        response = self.anthropic_client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=1000,
            system=system_prompt,
            messages=messages
        )
        return response.content[0].text
    
    def _chat_with_openai(self, message: str, conversation_history: Optional[list] = None) -> str:
        """Chat using OpenAI GPT"""
        system_prompt = """You are a helpful AI assistant for the "Parent in the Loop" platform. You help parents understand their child's school documents, navigate educational processes, and advocate for their children. 

Key guidelines:
- Use simple, clear language that's easy to understand
- Be supportive and encouraging to parents
- Focus on practical, actionable advice
- Help parents understand their rights and options
- If discussing school documents or processes, explain them in plain terms
- Always be respectful of different family backgrounds and circumstances"""
        
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history if provided
        if conversation_history:
            for chat_msg in conversation_history:
                messages.append({
                    "role": "user" if chat_msg["type"] == "user" else "assistant",
                    "content": chat_msg["content"]
                })
        
        # Add current message
        messages.append({
            "role": "user",
            "content": message
        })
        
        try:
            # Try new OpenAI client format
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                max_tokens=1000
            )
            return response.choices[0].message.content
        except AttributeError:
            # Fall back to older OpenAI format
            response = self.openai_client.ChatCompletion.create(
                model="gpt-4",
                messages=messages,
                max_tokens=1000
            )
            return response.choices[0].message.content
    
    def _generate_mock_chat_response(self, message: str) -> str:
        """Generate mock chat response when no LLM service is available"""
        return f"I understand you're asking about: '{message}'. I'm here to help you with your child's school. Let me look at your school papers and help you know what to do. I will give you simple steps to follow. (This is a demo response - please connect an AI service for real conversations.)"

    def _generate_mock_feedback(self, image_path: str) -> str:
        """Generate mock feedback when no LLM service is available"""
        return """📚 **Homework Analysis** (Demo Mode)

**Subject Assessment:**
This appears to be elementary-level homework. Great job on attempting all the problems!

**Positive Points:**
✅ Clear handwriting and organization
✅ Good effort shown in problem-solving approach
✅ Work is neatly presented

**Areas for Improvement:**
📝 Double-check your calculations on problems 3 and 5
📝 Consider showing more work steps for complex problems
📝 Review multiplication tables for faster computation

**Next Steps:**
🎯 Practice similar problems for 10-15 minutes daily
🎯 Use visual aids or manipulatives for difficult concepts
🎯 Ask your teacher about any confusing topics

**Encouragement:**
Keep up the great work! Learning is a process, and every mistake is a step toward understanding. You're doing amazing! 🌟

*Note: This is demo feedback. Connect an AI service for detailed analysis.*"""