from django.urls import path
from googleauth_app.views import GoogleLoginApi, LogoutApi

urlpatterns = [
    path('login/google/', GoogleLoginApi.as_view(), name='google_login'),
    path('logout/', LogoutApi.as_view(), name='logout'),
]