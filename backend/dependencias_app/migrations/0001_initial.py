# Generated by Django 5.0.3 on 2024-10-09 23:59

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(help_text='Informe o nome', max_length=100, validators=[django.core.validators.MinLengthValidator(3)], verbose_name='Nome')),
                ('email', models.EmailField(help_text='Informe o e-mail', max_length=254, verbose_name='Email')),
                ('perfil', models.CharField(choices=[('Professor', 'Professor'), ('Registros Escolares', 'Registros Escolares'), ('Gestão Escolar', 'Gestao Escolar'), ('Coordenador', 'Coordenador'), ('Aluno', 'Aluno')], max_length=100)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Curso',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(help_text='Informe o nome do curso', max_length=100, validators=[django.core.validators.MinLengthValidator(3)], verbose_name='Nome do Curso')),
                ('carga_horaria', models.CharField(help_text='Informe a carga horária do curso', max_length=5, verbose_name='Carga Horária')),
                ('modalidade', models.CharField(choices=[('ProEja', 'ProEja'), ('Integrado', 'Integrado')], help_text='Selecione a modalidade do curso', max_length=20, verbose_name='Modalidade')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Aluno',
            fields=[
                ('usuario_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dependencias_app.usuario')),
                ('cpf', models.CharField(help_text='Digite o CPF', max_length=11, validators=[django.core.validators.MinLengthValidator(11)], verbose_name='CPF')),
                ('dataNascimento', models.DateField(help_text='Informe a data de nascimento do Aluno', verbose_name='DataNascimento')),
                ('matricula', models.CharField(help_text='Informe a matrícula do Aluno', max_length=10, verbose_name='Matricula')),
                ('telefone', models.CharField(help_text='Informe o número de telefone do aluno', max_length=11, verbose_name='Telefone')),
            ],
            options={
                'abstract': False,
            },
            bases=('dependencias_app.usuario',),
        ),
        migrations.CreateModel(
            name='Servidor',
            fields=[
                ('usuario_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dependencias_app.usuario')),
                ('cpf', models.CharField(help_text='Digite o CPF', max_length=11, unique=True, validators=[django.core.validators.MinLengthValidator(11)], verbose_name='CPF')),
                ('matricula', models.CharField(help_text='Informe a matrícula do Servidor', max_length=10, unique=True, verbose_name='Matrícula')),
            ],
            options={
                'abstract': False,
            },
            bases=('dependencias_app.usuario',),
        ),
        migrations.CreateModel(
            name='Turma',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero', models.CharField(help_text='Informe o número da turma', max_length=10, validators=[django.core.validators.MinLengthValidator(1)], verbose_name='Número da Turma')),
                ('curso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dependencias_app.curso')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
