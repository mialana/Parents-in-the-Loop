from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .llm_service import LLMService


@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, world!"})


@api_view(['POST'])
@csrf_exempt
def chat_with_ai(request):
    llm_service = LLMService()
    
    message = request.data.get('message', '')
    conversation_history = request.data.get('conversation_history', [])
    
    if not message:
        return Response({"error": "Message is required"}, status=400)
    
    try:
        response = llm_service.chat_with_ai(message, conversation_history)
        return Response({"response": response})
    except Exception as e:
        return Response({"error": str(e)}, status=500)
