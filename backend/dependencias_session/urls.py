from django.urls import path
from dependencias_session.views.token_views import *
from dependencias_session.views.auth_views import logout


urlpatterns = [
    # views de autenticação
    path('tokens/', obter_tokens),
    path('tokens/refresh/', renovar_token),
    path('logout/', logout)
]