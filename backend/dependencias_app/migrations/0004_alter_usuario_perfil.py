# Generated by Django 5.1.1 on 2024-10-07 23:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dependencias_app', '0003_alter_usuario_perfil'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='perfil',
            field=models.CharField(choices=[('Professor', 'Professor'), ('Registros Escolares', 'Registros Escolares'), ('Gestão Escolar', 'Gestao Escolar'), ('Coordenador', 'Coordenador'), ('Aluno', 'Aluno')], max_length=100),
        ),
    ]