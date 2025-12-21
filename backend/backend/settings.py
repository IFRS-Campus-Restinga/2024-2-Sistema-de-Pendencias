import os
from pathlib import Path
import environ

# ------------------------------------------------------------------------------
# BASE
# ------------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
)

# Lê .env da raiz do projeto
environ.Env.read_env(BASE_DIR / ".env")

# ------------------------------------------------------------------------------
# CORE
# ------------------------------------------------------------------------------
SECRET_KEY = env("SECRET_KEY")
DEBUG = env.bool("DEBUG", default=False)

ALLOWED_HOSTS = env.list(
    "ALLOWED_HOSTS",
    default=["localhost", "127.0.0.1"]
)

# Necessário para OAuth em ambiente de desenvolvimento
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = env(
    "OAUTHLIB_INSECURE_TRANSPORT",
    default="1"
)

# ------------------------------------------------------------------------------
# CORS / COOKIES (API com cookies customizados)
# ------------------------------------------------------------------------------
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS",
    default=["http://localhost:3000"]
)

# ------------------------------------------------------------------------------
# APPLICATION DEFINITION
# ------------------------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    'django.contrib.sessions', 
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "corsheaders",
    "rest_framework",

    "hub_tools",
    "dependencias_app",
    "dependencias_session",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

# ------------------------------------------------------------------------------
# TEMPLATES
# ------------------------------------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            BASE_DIR / "dependencias_app" / "templates_email",
            BASE_DIR / "dependencias_app" / "templates_pdf",
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"

# ------------------------------------------------------------------------------
# DATABASE
# ------------------------------------------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ------------------------------------------------------------------------------
# REST_FRAMEWORK
# ------------------------------------------------------------------------------

REST_FRAMEWORK = {
    "EXCEPTION_HANDLER": "dependencias_app.utils.exceptions.custom_exception_handler"
}

# ------------------------------------------------------------------------------
# EMAIL
# ------------------------------------------------------------------------------
EMAIL_BACKEND = env(
    "EMAIL_BACKEND",
    default="django.core.mail.backends.smtp.EmailBackend"
)

EMAIL_HOST = env("EMAIL_HOST", default="smtp.gmail.com")
EMAIL_PORT = env.int("EMAIL_PORT", default=587)

EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS", default=True)
EMAIL_USE_SSL = env.bool("EMAIL_USE_SSL", default=False)

EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")

# ------------------------------------------------------------------------------
# AUTH / PASSWORDS
# ------------------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ------------------------------------------------------------------------------
# I18N
# ------------------------------------------------------------------------------
LANGUAGE_CODE = "pt-br"

TIME_ZONE = "America/Sao_Paulo"

USE_I18N = True
USE_TZ = True

LOCALE_PATHS = [BASE_DIR / "locale"]

# ------------------------------------------------------------------------------
# STATIC
# ------------------------------------------------------------------------------
STATIC_URL = "/static/"

# ------------------------------------------------------------------------------
# DEFAULT PK
# ------------------------------------------------------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ------------------------------------------------------------------------------
# CUSTOM SYSTEM VARS
# ------------------------------------------------------------------------------
BASE_SYSTEM_URL = env("BASE_SYSTEM_URL")
SYSTEM_ID = env("SYSTEM_ID")
API_KEY = env("API_KEY")

DRIVE_PLANO_ESTUDOS_FOLDER = env("DRIVE_PLANO_ESTUDOS_FOLDER")
DRIVE_ATIVIDADES_FOLDER = env("DRIVE_ATIVIDADES_FOLDER")
DRIVE_FORM_ENCERRAMENTO_FOLDER = env("DRIVE_FORM_ENCERRAMENTO_FOLDER")
