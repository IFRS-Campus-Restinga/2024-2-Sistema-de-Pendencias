# Generated by Django 5.1.1 on 2024-11-04 20:45

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
                ('nome', models.CharField(help_text='Informe o nome do curso', max_length=100, unique=True, validators=[django.core.validators.MinLengthValidator(3)], verbose_name='Nome do Curso')),
                ('carga_horaria', models.CharField(help_text='Informe a carga horária do curso', max_length=5, verbose_name='Carga Horária')),
                ('modalidade', models.CharField(choices=[('Integrado', 'Educação de Jovens e Adultos (EMI)'), ('ProEJA', 'Educação de Jovens e Adultos com Ensino Profissionalizante')], help_text='Selecione a modalidade do curso', max_length=20, verbose_name='Modalidade')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Evento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(help_text='Informe o titulo do evento', max_length=100, validators=[django.core.validators.MinLengthValidator(3)], verbose_name='Titulo')),
                ('descricao', models.CharField(help_text='Informe a descricao do evento', max_length=300, validators=[django.core.validators.MinLengthValidator(10)], verbose_name='Descricao')),
                ('data_inicio', models.DateTimeField(help_text='Informe a data inicial do evento', verbose_name='DataInicio')),
                ('data_fim', models.DateTimeField(help_text='Informe a data final do evento', verbose_name='DataFim')),
                ('tipo_calendario', models.CharField(choices=[('EMI', 'EMI'), ('PROEJA', 'PROEJA')], default='EMI', help_text='Selecione o tipo de calendário para o evento', max_length=6, verbose_name='TipoCalendario')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PPT',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('alunoEmail', models.EmailField(max_length=255)),
                ('disciplinaId', models.CharField(max_length=2)),
                ('professorId', models.CharField(max_length=2)),
                ('status', models.CharField(choices=[('criada', 'Criada'), ('plano_de_estudos_elaborado', 'Plano de Estudos Elaborado'), ('em_andamento', 'Em Andamento'), ('finalizado', 'Finalizado')], default='criada', max_length=50)),
                ('dataInicio', models.DateField()),
                ('dataFim', models.DateField()),
                ('notaFinal', models.FloatField(blank=True, null=True)),
                ('situacao', models.CharField(max_length=255)),
                ('observacao', models.TextField(blank=True)),
                ('curso', models.CharField(max_length=255)),
                ('turma', models.CharField(max_length=3)),
                ('turmaProgressao', models.CharField(max_length=50)),
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
                ('data_nascimento', models.DateField(help_text='Informe a data de nascimento do Aluno', verbose_name='DataNascimento')),
                ('matricula', models.CharField(help_text='Informe a matrícula do Aluno', max_length=10, verbose_name='Matricula')),
                ('telefone', models.CharField(help_text='Informe o número de telefone do aluno', max_length=11, verbose_name='Telefone')),
                ('usuario', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='aluno', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Disciplina',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Nome disciplina', max_length=36, verbose_name='Nome da Disciplina')),
                ('carga_horaria', models.PositiveIntegerField(help_text='Carga horaria', validators=[django.core.validators.MaxValueValidator(800)], verbose_name='Carga Horaria')),
                ('cursos', models.ManyToManyField(related_name='disciplinas', to='dependencias_app.curso')),
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
                ('usuario', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='professor', to=settings.AUTH_USER_MODEL)),
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
        migrations.CreateModel(
            name='DependenciaEMIPED',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('alunoEmail', models.EmailField(max_length=255)),
                ('disciplinaId', models.CharField(max_length=2)),
                ('professorId', models.CharField(max_length=2)),
                ('status', models.CharField(choices=[('criada', 'Criada'), ('plano_de_estudos_elaborado', 'Plano de Estudos Elaborado'), ('em_andamento', 'Em Andamento'), ('finalizado', 'Finalizado')], default='criada', max_length=50)),
                ('dataInicio', models.DateField()),
                ('dataFim', models.DateField()),
                ('notaFinal', models.FloatField(blank=True, null=True)),
                ('situacao', models.CharField(max_length=255)),
                ('observacao', models.TextField(blank=True)),
                ('matricula', models.PositiveIntegerField(verbose_name='Matrícula')),
                ('name', models.CharField(max_length=100, verbose_name='Nome')),
                ('turma_ped', models.CharField(max_length=50, verbose_name='Turma da PED')),
                ('trimestre_recuperar', models.CharField(choices=[('primeiro', 'Primeiro'), ('segundo', 'Segundo'), ('terceiro', 'Terceiro'), ('todos', 'Todos')], max_length=20, verbose_name='Trimestre a Recuperar')),
                ('curso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dependencias_emiped', to='dependencias_app.curso')),
                ('disciplina', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dependencias_emiped', to='dependencias_app.disciplina')),
                ('professor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dependencias_emiped', to='dependencias_app.professor')),
                ('turma', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dependencias_emiped', to='dependencias_app.turma')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
