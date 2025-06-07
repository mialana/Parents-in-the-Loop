from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Document
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
import logging
import asyncio

from .agent import query

logger = logging.getLogger(__name__)


@api_view(['GET'])
def get_dashboard_content(request, name):
    document = get_object_or_404(Document, name=name)

    result = asyncio.run(query("""Scan contents of directory and generate according to your instructions."""))

    return Response({"message": result})

@api_view(['POST'])
def upload_document(request):
    logger.info("Received upload request")
    logger.info(f"Request FILES: {request.FILES}")
    logger.info(f"Request DATA: {request.data}")
    
    if 'file' not in request.FILES:
        logger.error("No file provided in request")
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']
    name = request.data.get('name', file.name)
    doc_type = request.data.get('type', 'Unknown')
    
    logger.info(f"Processing file: {name}, type: {doc_type}")
    
    try:
        # Save the file
        document = Document.objects.create(
            file=file,
            name=name,
            type=doc_type,
            status='processed'
        )
        
        logger.info(f"File saved successfully with ID: {document.id}")
        
        return Response({
            'id': document.id,
            'name': document.name,
            'type': document.type,
            'status': document.status,
            'upload_date': document.upload_date
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
