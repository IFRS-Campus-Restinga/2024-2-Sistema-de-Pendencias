# Generated by Django 5.1.1 on 2024-10-06 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dependencias_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='perfil',
            field=models.CharField(choices=[('Professor', 'Professor'), ('Registros Escolares', 'Registros Escolares'), ('Gestão Escolar', 'Gestao Escolar'), ('Coordenador', 'Coordenador'), ('Aluno', 'Aluno')], max_length=100),
        ),
    ]