from django.urls import path
from .views import hello_world, chat_with_ai


urlpatterns = [
    path('hello/', hello_world),
    path('chat/', chat_with_ai),
]
