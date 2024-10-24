"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 4.1.13.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-7jt7#zg-+cgon0@ssb5ih-yq5^d-9@5_ixys$=mh+t^d9g%50_'

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1']
CSRF_TRUSTED_ORIGINS = ["http://127.0.0.1:3000", "https://017e-177-4-48-163.ngrok-free.app"]
CSRF_ALLOWED_ORIGINS = ["http://127.0.0.1:3000", "https://017e-177-4-48-163.ngrok-free.app"]
CORS_ORIGINS_WHITELIST = ["http://127.0.0.1:3000", "https://017e-177-4-48-163.ngrok-free.app"]
CORS_ALLOWED_ORIGINS = ["http://127.0.0.1:3000"]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'dependencias_app',
    'google_auth',
    'rest_framework',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [f'{BASE_DIR}/backend/google_auth/templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

CORS_ALLOWED_HEADERS = [
    'Content-Type',
    'X-CSRFToken',
    'Authorization',
]

# Permita que cookies sejam acessíveis pelo frontend
CSRF_COOKIE_SAMESITE = 'Lax'  # ou 'Lax' dependendo do caso
SESSION_COOKIE_SAMESITE = 'Lax'  # ou 'Lax' dependendo do caso

# Se você estiver usando HTTPS
CSRF_COOKIE_SECURE = False  
SESSION_COOKIE_SECURE = False 

CSRF_COOKIE_HTTPONLY = False
SESSION_COOKIE_HTTPONLY = False

AUTH_USER_MODEL = 'google_auth.UsuarioBase'

CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated"
    ]
}

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

GOOGLE_OAUTH2_CLIENT_ID = os.getenv('GOOGLE_OAUTH2_CLIENT_ID')
GOOGLE_OAUTH2_CLIENT_SECRET = os.getenv('GOOGLE_OAUTH2_CLIENT_SECRET')
GOOGLE_OAUTH2_PROJECT_ID = os.getenv('GOOGLE_OAUTH2_PROJECT_ID')
REDIRECT_URI = os.getenv('REDIRECT_URI')
BASE_APP_URL = os.getenv('BASE_APP_URL')
BASE_API_URL = os.getenv('BASE_API_URL')
LOGIN_URL = os.getenv('LOGIN_URL')