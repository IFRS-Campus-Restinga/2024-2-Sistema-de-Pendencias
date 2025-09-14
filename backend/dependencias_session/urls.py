from django.urls import path
from dependencias_session.views.token_views import *


urlpatterns = [
    # views de autenticação
    path('tokens/', obter_tokens),
    path('tokens/refresh/', renovar_token),
]