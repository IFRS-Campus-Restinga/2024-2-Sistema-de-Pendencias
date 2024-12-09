from rest_framework import serializers
from dependencias_app.models.planoEstudos import PlanoEstudos
from dependencias_app.models.notificacao import Notificacao
from django.conf import settings

class PlanoEstudos_Serializer(serializers.ModelSerializer):
    class Meta:
        model = PlanoEstudos
        fields = '__all__'

    def save(self, **kwargs):
        formPlanoEstudo = super().save(**kwargs)
        formPlanoEstudo.full_clean()
        formPlanoEstudo.save()

        Notificacao.objects.create(usuario=formPlanoEstudo.dependencia_emi.aluno or formPlanoEstudo.dependencia_proeja.aluno, tipo='Plano de Estudos', mensagem='Novo Plano de Estudos', url=f'{settings.BASE_APP_URL}/sessao/Aluno/{formPlanoEstudo.dependencia_emi.aluno.id or formPlanoEstudo.dependencia_proeja.aluno.id}/Integrado/{formPlanoEstudo.dependencia_emi.id or formPlanoEstudo.dependencia_proeja.id}/planoEstudos')

        # cria notificação para a gestão
        # Notificacao.objects.create()

        return formPlanoEstudo