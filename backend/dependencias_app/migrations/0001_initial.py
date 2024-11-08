# Generated by Django 5.1.1 on 2024-11-08 22:25

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
            name='Evento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(help_text='Informe o titulo do evento', max_length=100, validators=[django.core.validators.MinLengthValidator(3)], verbose_name='Titulo')),
                ('descricao', models.CharField(help_text='Informe a descricao do evento', max_length=300, validators=[django.core.validators.MinLengthValidator(10)], verbose_name='Descricao')),
                ('data_inicio', models.DateTimeField(help_text='Informe a data inicial do evento', verbose_name='DataInicio')),
                ('data_fim', models.DateTimeField(help_text='Informe a data final do evento', verbose_name='DataFim')),
                ('tipo_calendario', models.CharField(choices=[('Integrado', 'Ensino Médio Integrado'), ('ProEJA', 'Educação de Jovens e Adultos com Ensino Profissionalizante')], default='Integrado', help_text='Selecione o tipo de calendário para o evento', max_length=9, verbose_name='TipoCalendario')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='FormEncerramento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parecerFinal', models.TextField(max_length=500)),
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
            name='Curso',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(help_text='Informe o nome do curso', max_length=100, unique=True, validators=[django.core.validators.MinLengthValidator(3)], verbose_name='Nome do Curso')),
                ('carga_horaria', models.CharField(help_text='Informe a carga horária do curso', max_length=5, verbose_name='Carga Horária')),
                ('modalidade', models.CharField(choices=[('Integrado', 'Ensino Médio Integrado'), ('ProEJA', 'Educação de Jovens e Adultos com Ensino Profissionalizante')], help_text='Selecione a modalidade do curso', max_length=20, verbose_name='Modalidade')),
                ('coordenador', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Disciplina',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(help_text='Nome disciplina', max_length=36, verbose_name='Nome da Disciplina')),
                ('carga_horaria', models.PositiveIntegerField(help_text='Carga horaria', validators=[django.core.validators.MaxValueValidator(800)], verbose_name='Carga Horaria')),
                ('cursos', models.ManyToManyField(related_name='disciplinas', to='dependencias_app.curso')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PlanoEstudos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('campus', models.CharField(default='Restinga', help_text='Informe o campus', max_length=20, verbose_name='Campus')),
                ('semestre_ano_letivo', models.CharField(help_text='Exemplo: 2024/1', max_length=5, verbose_name='Semestre/Ano Letivo')),
                ('componente_curricular', models.CharField(help_text='Informe o componente curricular', max_length=100, verbose_name='Componente Curricular')),
                ('semestre_serie_curso', models.CharField(help_text='Informe o semestre/série', max_length=20, verbose_name='Semestre/Série do Curso')),
                ('trimestre_recuperar', models.CharField(help_text='Informe o trimestre', max_length=20, verbose_name='Trimestre a Recuperar')),
                ('forma_oferta', models.CharField(choices=[('Presencial', 'Presencial'), ('EAD', 'Ead'), ('Híbrido', 'Hibrido')], help_text='Selecione a forma de oferta', max_length=20, verbose_name='Forma de Oferta')),
                ('turno', models.CharField(choices=[('Manhã', 'Manha'), ('Tarde', 'Tarde'), ('Noite', 'Noite'), ('Integral', 'Integral')], help_text='Selecione o turno', max_length=10, verbose_name='Turno')),
                ('parecer_pedagogico', models.TextField(help_text='Informe o parecer pedagógico', max_length=500, verbose_name='Parecer Pedagógico')),
                ('aluno', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='aluno_planoEstudos', to=settings.AUTH_USER_MODEL)),
                ('curso', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='curso_planoEstudos', to='dependencias_app.curso')),
                ('disciplina', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='disciplina_planoEstudos', to='dependencias_app.disciplina')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PED_EMI',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Criada', 'Criada'), ('Plano de Estudos Elaborado', 'Plano Estudos Elaborado'), ('Em Andamento', 'Em Andamento'), ('Finalizada', 'Finalizado')], default='Criada', max_length=50)),
                ('dataInicio', models.DateField()),
                ('dataFim', models.DateField(blank=True, null=True)),
                ('notaFinal', models.FloatField(default=0)),
                ('situacao', models.CharField(choices=[('Aprovado', 'Aprovado'), ('Reprovado', 'Reprovado'), ('Em avaliação', 'Em Avaliacao')], default='Em avaliação', max_length=255)),
                ('observacao', models.TextField(blank=True, null=True)),
                ('trimestreRec', models.CharField(choices=[('1º', 'Primeiro'), ('2º', 'Segundo'), ('3º', 'Terceiro'), ('1º e 2º', 'Primeiro Segundo'), ('1º e 3º', 'Primeiro Terceiro'), ('2º e 3º', 'Segundo Terceiro'), ('Todos', 'Todos')], max_length=8)),
                ('serieAnoProgressao', models.CharField(choices=[('1º Ano', 'Ano 1'), ('2º Ano', 'Ano 2'), ('3º Ano', 'Ano 3'), ('4º Ano', 'Ano 4')], max_length=7)),
                ('aluno', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='aluno_ped_emi', to=settings.AUTH_USER_MODEL)),
                ('curso', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='curso_ped_emi', to='dependencias_app.curso')),
                ('disciplina', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='disciplina_ped_emi', to='dependencias_app.disciplina')),
                ('form_encerramento', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='form_encerramento_EMI', to='dependencias_app.formencerramento')),
                ('professor', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='professor_ped_emi', to=settings.AUTH_USER_MODEL)),
                ('plano_estudos', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='plano_estudos_EMI', to='dependencias_app.planoestudos')),
            ],
            options={
                'verbose_name_plural': 'PEDs EMI',
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
            name='PPT',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Criada', 'Criada'), ('Plano de Estudos Elaborado', 'Plano Estudos Elaborado'), ('Em Andamento', 'Em Andamento'), ('Finalizada', 'Finalizado')], default='Criada', max_length=50)),
                ('dataInicio', models.DateField()),
                ('dataFim', models.DateField(blank=True, null=True)),
                ('notaFinal', models.FloatField(default=0)),
                ('situacao', models.CharField(choices=[('Aprovado', 'Aprovado'), ('Reprovado', 'Reprovado'), ('Em avaliação', 'Em Avaliacao')], default='Em avaliação', max_length=255)),
                ('observacao', models.TextField(blank=True, null=True)),
                ('aluno', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='aluno_ppt', to=settings.AUTH_USER_MODEL)),
                ('curso', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='curso_ppt', to='dependencias_app.curso')),
                ('disciplina', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='disciplina_ppt', to='dependencias_app.disciplina')),
                ('turmaOrigem', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='turma_origem', to='dependencias_app.turma')),
                ('turmaProgressao', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='turma_progressao', to='dependencias_app.turma')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
