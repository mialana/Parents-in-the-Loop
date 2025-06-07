from django.urls import path
from .views import get_dashboard_content, upload_document


urlpatterns = [
    path('dashboard/content/<str:name>/', get_dashboard_content),
    path('upload/', upload_document),
]
