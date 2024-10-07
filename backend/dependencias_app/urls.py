from django.urls import path
from dependencias_app.views import teste
<<<<<<< HEAD
from dependencias_app.views import cadastrar_servidor

urlpatterns = [
    path('teste', teste.view_teste),
    path('cadastrar-servidor/', cadastrar_servidor.cadastrar_servidor, name='cadastrar_servidor'),
=======
from dependencias_app.views import csrf_token

urlpatterns = [
    path('teste', teste.view_teste),
    path('auth/csrf_token', csrf_token.csrf_token_view)
>>>>>>> c2407baa83cea70b16090b6f3b42ea1a2ecdbcb8
]
