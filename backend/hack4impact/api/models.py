from django.db import models

class Document(models.Model):
    file = models.FileField(upload_to='uploads/')
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    upload_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')

    def __str__(self):
        return self.name 