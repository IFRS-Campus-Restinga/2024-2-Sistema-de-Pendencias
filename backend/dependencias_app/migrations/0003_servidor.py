# Generated by Django 5.0.6 on 2024-10-02 01:18

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dependencias_app', '0002_remove_usuario_oi'),
    ]

    operations = [
        migrations.CreateModel(
            name='Servidor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('perfil', models.CharField(choices=[('Professor', 'Professor'), ('Registros Escolares', 'Registro Escolares'), ('Gestão Escolar', 'Gestao Escolar'), ('Coordenador', 'Coordenador')], help_text='Informe o perfil', max_length=100, verbose_name='Perfil')),
                ('nome', models.CharField(help_text='Informe o nome', max_length=100, validators=[django.core.validators.MinLengthValidator(3)], verbose_name='Nome')),
                ('cpf', models.CharField(help_text='Digite o CPF', max_length=11, unique=True, validators=[django.core.validators.MinLengthValidator(11)], verbose_name='CPF')),
                ('matricula', models.CharField(help_text='Informe a matrícula do Aluno', max_length=10, unique=True, verbose_name='Matricula')),
                ('email', models.EmailField(help_text='Informe o e-mail', max_length=254, verbose_name='Email')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]