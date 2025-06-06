from django.urls import path
from .views import hello_world, upload_document


urlpatterns = [
    path('hello/', hello_world),
    path('upload/', upload_document),
]
