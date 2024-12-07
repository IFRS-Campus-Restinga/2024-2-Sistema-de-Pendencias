from rest_framework import serializers
from dependencias_app.models.planoEstudos import PlanoEstudos
import os
from dependencias_app.utils.enviar_email import enviar_email

class PlanoEstudos_Serializer(serializers.ModelSerializer):
    class Meta:
        model = PlanoEstudos
        fields = '__all__'

    def save(self, **kwargs):
        formPlanoEstudo = super().save(**kwargs)
        formPlanoEstudo.full_clean()
        formPlanoEstudo.save()

        template = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        'templates_email',
        'planoDeEstudos.html'
        )

        enviar_email(formPlanoEstudo.dependencia_emi.aluno.email or formPlanoEstudo.dependencia_proeja.aluno.email, template, 'Plano de Estudos Cadastrado')

        return formPlanoEstudo