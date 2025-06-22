from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Document
from django.shortcuts import get_object_or_404
from django.utils.text import slugify
import logging
import asyncio
import os

from .agent import query

logger = logging.getLogger(__name__)


@api_view(["GET"])
def get_dashboard_content(request, name):
    document = get_object_or_404(Document, name=name)

    document_dir = os.path.dirname(document.file.path) + "/"

    result = asyncio.run(
        query(
            filepath=document_dir,
            message="Process filesystem according to your instructions.",
        )
    )

    return Response({"message": result})


@api_view(["POST"])
def upload_document(request):
    logger.info("Received upload request")
    logger.info(f"Request FILES: {request.FILES}")
    logger.info(f"Request DATA: {request.data}")

    if "file" not in request.FILES:
        logger.error("No file provided in request")
        return Response(
            {"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST
        )

    file = request.FILES["file"]
    name = request.data.get("name", file.name)
    doc_type = request.data.get("type", "Unknown")
    dirname = os.path.join("uploads", slugify(os.path.splitext(name)[0]))

    logger.info(f"Processing file: {name}, type: {doc_type}")

    try:
        # Save the file
        document = Document.objects.create(
            file=file, name=name, type=doc_type, status="processed", dirname=dirname
        )

        logger.info(f"File saved successfully with name: {document.name}")

        return Response(
            {
                "name": document.name,
                "type": document.type,
                "status": document.status,
                "upload_date": document.upload_date,
            },
            status=status.HTTP_201_CREATED,
        )
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
