from django.urls import path
from .views import hello_world, chat_with_ai, upload_document


urlpatterns = [
    path('hello/', hello_world),
    path('chat/', chat_with_ai),
    path('upload/', upload_document),
]
