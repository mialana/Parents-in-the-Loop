import os
from django.db import models


def set_document_upload_to(instance: "Document", filename: str):
    return os.path.join(instance.dirname, filename)


class Document(models.Model):
    name = models.CharField(max_length=255, primary_key=True)
    type = models.CharField(max_length=100)
    upload_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')
    dirname = models.CharField(max_length=255, default="general")
    file = models.FileField(upload_to=set_document_upload_to)

    def __str__(self):
        return self.name
