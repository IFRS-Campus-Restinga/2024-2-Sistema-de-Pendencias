from django.urls import path
from dependencias_app.views import teste
from dependencias_app.views import csrf_token

urlpatterns = [
    path('teste', teste.view_teste),
    path('auth/csrf_token', csrf_token.csrf_token_view)
]
