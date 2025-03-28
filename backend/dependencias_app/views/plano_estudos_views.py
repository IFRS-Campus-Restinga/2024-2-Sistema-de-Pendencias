import os
import threading
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import *
from rest_framework.response import Response
from rest_framework import status
from backend.dependencias_app.models.plano_estudos import *
from backend.dependencias_app.serializers.plano_estudos_serializer import *
from dependencias_app.permissoes import *
from dependencias_app.utils.enviar_email import enviar_email
from google_auth.models import UsuarioBase

template = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        'templates_email',
        'planoDeEstudos.html'
        )

@api_view(['POST'])
@permission_classes([GestaoEscolar | Professor])
def cadastrar_plano_estudos(request, modalidade):
    try:
        data = request.data

        if modalidade == 'Integrado':
            serializer = Plano_Estudos_EMI_Serializer(data=data)

        elif modalidade == 'ProEJA':
            serializer = Plano_Estudos_ProEJA_Serializer(data=data)
        
        if not serializer.is_valid(): raise Exception(serializer.errors)

        lista_gestao = UsuarioBase.objects.filter(grupo__name='Gestão Escolar')

        # envia email para os perfis de gestão do sistema de forma assíncrona

        for gestao in lista_gestao:
            threading.Thread(target=enviar_email, args=(gestao, template, 'Novo Plano de Estudos Cadastrado', gestao.grupo.name)).start()

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET'])
@permission_classes([GestaoEscolar | Professor | Aluno])
def detalhes_plano_estudos(request, planoId, modalidade):
    try:
        if modalidade == 'Integrado':
            plano = get_object_or_404(Plano_Estudos_EMI, pk=planoId)

            serializer = Plano_Estudos_EMI_Serializer(plano, context={'request': request})
        elif modalidade == 'ProEJA':
            plano = get_object_or_404(Plano_Estudos_ProEJA, pk=planoId)
            
            serializer = Plano_Estudos_ProEJA_Serializer(plano, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)        
    except Exception as e:
        return Response({'mensagem':str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([GestaoEscolar | Professor])
def editar_plano_estudos(request, planoId, modalidade):
    try:
        data = request.data

        if modalidade == 'Integrado':
            plano = get_object_or_404(Plano_Estudos_EMI, pk=planoId)
            ped = get_object_or_404(PED_EMI, pk=plano.ped.id)
            serializer = Plano_Estudos_EMI_Serializer(plano, data=data, partial=True)
        
        elif modalidade == 'ProEJA':
            plano = get_object_or_404(Plano_Estudos_ProEJA, pk=planoId)
            ped = get_object_or_404(PED_ProEJA, pk=plano.ped.id)
            serializer = Plano_Estudos_ProEJA_Serializer(plano, data=data, partial=True)

        if not serializer.is_valid(): raise Exception(serializer.errors)

        if data['aprovado'] == True:
            ped.status = 'Em Andamento'
            ped.save()
            threading.Thread(target=enviar_email, args=(serializer.instance.ped.aluno, template, 'Novo Plano de Estudos Cadastrado', serializer.instance.ped.aluno.grupo.name)).start()

        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

