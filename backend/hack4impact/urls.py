"""
URL configuration for hack4impact project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('hack4impact.api.urls')),
]