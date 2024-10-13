# Generated by Django 5.1.1 on 2024-10-12 14:01

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(help_text='Informe o nome', max_length=100, validators=[django.core.validators.MinLengthValidator(3)], verbose_name='Nome')),
                ('email', models.EmailField(help_text='Informe o e-mail', max_length=254, verbose_name='Email')),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('grupo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auth.group')),
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
                ('modalidade', models.CharField(choices=[('EMI', 'Educação de Jovens e Adultos (EMI)'), ('PROEJA', 'Educação de Jovens e Adultos com Ensino Profissionalizante')], max_length=22, verbose_name='Modalidade')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Aluno',
            fields=[
                ('usuario_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dependencias_app.usuario')),
                ('cpf', models.CharField(blank=True, help_text='Digite o CPF', max_length=11, null=True, validators=[django.core.validators.MinLengthValidator(11)], verbose_name='CPF')),
                ('dataNascimento', models.DateField(blank=True, help_text='Informe a data de nascimento do Aluno', null=True, verbose_name='DataNascimento')),
                ('matricula', models.CharField(help_text='Informe a matrícula do Aluno', max_length=10, verbose_name='Matricula')),
                ('telefone', models.CharField(blank=True, help_text='Informe o número de telefone do aluno', max_length=11, null=True, verbose_name='Telefone')),
            ],
            options={
                'abstract': False,
            },
            bases=('dependencias_app.usuario',),
        ),
        migrations.CreateModel(
            name='Coordenador',
            fields=[
                ('usuario_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dependencias_app.usuario')),
            ],
            options={
                'abstract': False,
            },
            bases=('dependencias_app.usuario',),
        ),
        migrations.CreateModel(
            name='GestaoEscolar',
            fields=[
                ('usuario_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dependencias_app.usuario')),
                ('cpf', models.CharField(blank=True, help_text='Digite o CPF', max_length=11, null=True, validators=[django.core.validators.MinLengthValidator(11)], verbose_name='CPF')),
                ('matricula', models.CharField(blank=True, help_text='Informe a matrícula do(a) gestor(a)', max_length=10, null=True, verbose_name='Matricula')),
            ],
            options={
                'abstract': False,
            },
            bases=('dependencias_app.usuario',),
        ),
        migrations.CreateModel(
            name='Professor',
            fields=[
                ('usuario_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dependencias_app.usuario')),
                ('cpf', models.CharField(blank=True, help_text='Digite o CPF', max_length=11, null=True, validators=[django.core.validators.MinLengthValidator(11)], verbose_name='CPF')),
                ('matricula', models.CharField(help_text='Informe a matrícula do Aluno', max_length=10, verbose_name='Matricula')),
            ],
            options={
                'abstract': False,
            },
            bases=('dependencias_app.usuario',),
        ),
        migrations.CreateModel(
            name='RegistroEscolar',
            fields=[
                ('usuario_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='dependencias_app.usuario')),
            ],
            options={
                'abstract': False,
            },
            bases=('dependencias_app.usuario',),
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
