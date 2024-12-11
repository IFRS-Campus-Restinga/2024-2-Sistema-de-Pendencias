from rest_framework import serializers
from dependencias_app.models.planoEstudos import PlanoEstudos
from dependencias_app.models.notificacao import Notificacao
from django.conf import settings

class PlanoEstudos_Serializer(serializers.ModelSerializer):
    class Meta:
        model = PlanoEstudos
        fields = '__all__'

        def save(self, **kwargs):
        # Salva o Plano de Estudos e executa a validação
            formPlanoEstudo = super().save(**kwargs)
            formPlanoEstudo.full_clean()
            formPlanoEstudo.save()

            # Acessa o aluno a partir do PED vinculado
            ped_emi = getattr(formPlanoEstudo, 'dependencia_emi', None)
            ped_proeja = getattr(formPlanoEstudo, 'dependencia_proeja', None)

            aluno = None
            if ped_emi:
                aluno = ped_emi.aluno
            elif ped_proeja:
                aluno = ped_proeja.aluno

            if aluno:
                Notificacao.objects.create(
                    usuario=aluno,
                    tipo='Plano de Estudos',
                    mensagem='Novo Plano de Estudos',
                    url=f'{settings.BASE_APP_URL}/sessao/Aluno/{aluno.id}/Integrado/{ped_emi.id if ped_emi else ped_proeja.id}/planoEstudos'
                )

            # Adicione lógica para notificação da gestão aqui, se necessário
            # Notificacao.objects.create(...)

            return formPlanoEstudo
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request', None)
        retorno = request and request.query_params.get('retorno')

        if retorno == 'aluno':
            representation.pop('parecer_pedagogico')

        return representation