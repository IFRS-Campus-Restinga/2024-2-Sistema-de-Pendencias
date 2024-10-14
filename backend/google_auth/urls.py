from django.urls import path
from google_auth.views import google_login

urlpatterns = [
    path('login/google/', google_login, name='google_login'),
]