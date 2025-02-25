from rest_framework import serializers
from dependencias_app.models.planoEstudos import *
from dependencias_app.models.notificacao import Notificacao
from django.conf import settings

class PlanoEstudos_EMI_Serializer(serializers.ModelSerializer):
    class Meta:
        model = PlanoEstudos_EMI
        fields = '__all__'

    def save(self, **kwargs):
    # Salva o Plano de Estudos e executa a validação
        plano = super().save(**kwargs)
        plano.full_clean()
        plano.save()

        # Acessa o aluno a partir do PED vinculado
        ped_emi = plano.ped

        if ped_emi:
            aluno = ped_emi.aluno

        return plano
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request', None)
        retorno = request and request.query_params.get('retorno')

        if retorno == 'aluno':
            representation.pop('parecer_pedagogico')

        return representation
    

class PlanoEstudos_ProEJA_Serializer(serializers.ModelSerializer):
    class Meta:
        model = PlanoEstudos_ProEJA
        fields = '__all__'

    def save(self, **kwargs):
    # Salva o Plano de Estudos e executa a validação
        plano = super().save(**kwargs)
        plano.full_clean()
        plano.save()

        # Acessa o aluno a partir do PED vinculado
        ped_proeja = plano.ped

        if ped_proeja:
            aluno = ped_proeja.aluno

        return plano
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        request = self.context.get('request', None)
        retorno = request and request.query_params.get('retorno')

        if retorno == 'aluno':
            representation.pop('parecer_pedagogico')

        return representation