from django.db import models

class HomeworkImage(models.Model):
    image = models.ImageField(upload_to='homework_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    feedback = models.TextField(blank=True, null=True)
    processed = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Homework image uploaded at {self.uploaded_at}"