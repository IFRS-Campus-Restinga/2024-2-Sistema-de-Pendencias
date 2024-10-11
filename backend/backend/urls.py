from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('dependencias_app.urls')),
    path('auth/api/', include('google_auth.urls')),
]