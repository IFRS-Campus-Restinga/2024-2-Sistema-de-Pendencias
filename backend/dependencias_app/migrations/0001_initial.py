# Generated by Django 5.1.1 on 2024-10-20 21:32

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Curso',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(help_text='Informe o nome do curso', max_length=100, validators=[django.core.validators.MinLengthValidator(3)], verbose_name='Nome do Curso')),
                ('carga_horaria', models.CharField(help_text='Informe a carga horária do curso', max_length=5, verbose_name='Carga Horária')),
                ('modalidade', models.CharField(choices=[('EMI', 'Educação de Jovens e Adultos (EMI)'), ('PROEJA', 'Educação de Jovens e Adultos com Ensino Profissionalizante')], help_text='Selecione a modalidade do curso', max_length=20, verbose_name='Modalidade')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Aluno',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cpf', models.CharField(help_text='Digite o CPF', max_length=11, validators=[django.core.validators.MinLengthValidator(11)], verbose_name='CPF')),
                ('dataNascimento', models.DateField(help_text='Informe a data de nascimento do Aluno', verbose_name='DataNascimento')),
                ('matricula', models.CharField(help_text='Informe a matrícula do Aluno', max_length=10, verbose_name='Matricula')),
                ('telefone', models.CharField(help_text='Informe o número de telefone do aluno', max_length=11, verbose_name='Telefone')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Disciplina',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Informe o nome da Disciplina', max_length=36, verbose_name='Nome da Disciplina')),
                ('carga_horaria', models.IntegerField(help_text='Informe a carga horária da Disciplina', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(850)], verbose_name='Carga Horária')),
                ('curso', models.ForeignKey(help_text='Selecione o curso da Disciplina', on_delete=django.db.models.deletion.CASCADE, related_name='disciplinas', to='dependencias_app.curso', verbose_name='Curso')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Professor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cpf', models.CharField(blank=True, help_text='Digite o CPF', max_length=11, null=True, validators=[django.core.validators.MinLengthValidator(11)], verbose_name='CPF')),
                ('matricula', models.CharField(help_text='Informe a matrícula do Aluno', max_length=10, verbose_name='Matricula')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Turma',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero', models.CharField(help_text='Informe o número da turma', max_length=10, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Número da Turma')),
                ('curso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='turmas', to='dependencias_app.curso')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
