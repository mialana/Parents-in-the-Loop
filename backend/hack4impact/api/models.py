from django.db import models

class HomeworkImage(models.Model):
    image = models.ImageField(upload_to='homework_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    feedback = models.TextField(blank=True, null=True)
    processed = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Homework image uploaded at {self.uploaded_at}"

class Document(models.Model):
    file = models.FileField(upload_to='uploads/')
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    upload_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')

    def __str__(self):
        return self.name 
