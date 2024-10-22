from django.urls import path
from google_auth.views.login_dependencias_app import *
from google_auth.views.login_django_admin import *

urlpatterns = [
    path('login/google/', login_view),
    path('logout/google/', logout_view),
    path('login', admin_login, name='google_login'),
    path('google-callback/', google_callback, name='google_callback'),
]