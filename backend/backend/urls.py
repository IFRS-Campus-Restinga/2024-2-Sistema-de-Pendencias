from django.contrib import admin
from django.urls import path, include
from google_auth.views.login_django_admin import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('django-admin/', include('google_auth.urls')),
    path('auth/api/', include('google_auth.urls')),
    path('api/', include('dependencias_app.urls')),
]