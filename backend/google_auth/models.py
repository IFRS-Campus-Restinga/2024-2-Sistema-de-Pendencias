from django.contrib.auth.models import AbstractUser, BaseUserManager, Group
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O email deve ser fornecido')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser deve ter is_superuser=True.')

        return self.create_user(email, password=None, **extra_fields)

class UsuarioBase(AbstractUser):
    nome = models.CharField(max_length=100, help_text="Informe o nome", null=True, blank=True)
    primeiro_login = models.BooleanField(default=True)
    email = models.EmailField(unique=True)
    grupo = models.ForeignKey(Group, on_delete=models.CASCADE, blank=True, null=True, related_name="usuarios", verbose_name="Grupo")
    data_ingresso = models.DateField(verbose_name="data de Ingresso", null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    last_login = None
    password = None
    username = None
    groups = None
    last_name = None
    first_name = None

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'Usuário Base'

    def __str__(self) -> str:
        if self.grupo and self.grupo.name == 'Aluno':  # Verifica se o grupo existe e tem o atributo 'name'
            return self.nome or self.email.split('@')[0]
        
        return self.nome or self.email

