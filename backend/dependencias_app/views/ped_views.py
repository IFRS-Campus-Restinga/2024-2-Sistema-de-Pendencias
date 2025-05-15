import os
import threading
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from dependencias_app.models.ped_EMI import PED_EMI
from dependencias_app.models.ped_ProEJA import PED_ProEJA
from dependencias_app.models.professor_progressao import *
from dependencias_app.serializers.ped_EMI_serializer import *
from dependencias_app.serializers.ped_ProEJA_serializer import *
from dependencias_app.serializers.professor_ped_serializer import *
from dependencias_app.permissoes import *
from dependencias_app.utils.enviar_email import enviar_email
from rest_framework.pagination import PageNumberPagination

class PEDPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100 

template = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    'templates_email',
    'novaPED.html'
    )

@api_view(['POST'])
@permission_classes([GestaoEscolar])
def cadastrar_PED(request, modalidade):
    try:
        data = request.data
        professor = data.pop('professor_ped', None)

        if modalidade == 'Integrado':
            serializer_ped = PED_EMI_Serializer(data=data)
            serializer_professor = Professor_PED_EMI_Serializer
        elif modalidade == 'ProEJA':
            serializer_ped = PED_ProEJA_Serializer(data=data)
            serializer_professor = Professor_PED_ProEJA_Serializer
        else:
            raise Exception('Modalidade inválida')

        if not serializer_ped.is_valid(): raise serializers.ValidationError(serializer_ped.errors)
    
        serializer_ped.save()

        serializer_professor = serializer_professor(data={'professor': professor, 'responsavel_atual': True, 'ped': serializer_ped.instance.id})

        if not serializer_professor.is_valid(): raise serializers.ValidationError(serializer_professor.errors)

        serializer_professor.save()

        # envia email para o professor responsável e aluno da ped de forma assíncrona
        threading.Thread(target=enviar_email, args=(serializer_ped.instance.aluno, template, 'Nova Dependência Cadastrada', serializer_ped.instance.aluno.grupo.name)).start()
        threading.Thread(target=enviar_email, args=(serializer_professor.instance.professor, template, 'Nova Dependência Cadastrada', serializer_professor.instance.professor.grupo.name)).start()

        return Response({'mensagem': 'Progressão registrada com sucesso!'}, status=status.HTTP_201_CREATED)
    except serializers.ValidationError as e:
        error_details = e.detail
        mensagens = []

        if isinstance(error_details, dict):
            for campo, erros in error_details.items():
                for erro in erros:
                    mensagens.append(f"{campo}: {str(erro)}")
        elif isinstance(error_details, list):
            for erro in error_details:
                mensagens.append(str(erro))
        else:
            mensagens.append(str(error_details))

        return Response({'mensagem': mensagens}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([GestaoEscolar | Professor | Coordenador])
def listar_PED(request, modalidade):
    
    try:
        busca = request.query_params.get('busca', '').strip()
        page_size = request.query_params.get('page_size', 15)

        usuarioId = request.user.id

        if modalidade == 'Integrado':
            modelo = PED_EMI
            serializer_class = PED_EMI_Serializer
            professor_related_name = 'professores_emi'
        elif modalidade == 'ProEJA':
            modelo = PED_ProEJA
            serializer_class = PED_ProEJA_Serializer
            professor_related_name = 'professores_proeja'
        if request.user.grupo.name == 'Professor':
            peds = modelo.objects.filter(professor_ped=usuarioId)
        elif request.user.grupo.name == 'Coordenador':
            peds = modelo.objects.filter(curso__coordenador_id=usuarioId)
        elif busca:
            peds = modelo.objects.filter(
                Q(aluno__nome__icontains=busca) |
                Q(aluno__email__icontains=busca) |
                Q(professor_disciplina__nome__icontains=busca) |
                Q(professor_disciplina__email__icontains=busca) |
                Q(**{
                    f"{professor_related_name}__professor__email__icontains": busca,
                    f"{professor_related_name}__responsavel_atual": True
                }) |
                Q(curso__nome__icontains=busca) |
                Q(disciplina__nome__icontains=busca)
            )
        else:
            peds = modelo.objects.all()

        paginator = PEDPagination()
        paginator.page_size = page_size
        result_page = paginator.paginate_queryset(peds, request)

        serializer = serializer_class(result_page, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([GestaoEscolar | Professor | Coordenador | Aluno])
def detalhes_PED(request, pedId, modalidade):
    try:
        if modalidade == 'Integrado':
            ped = get_object_or_404(PED_EMI, pk=pedId)
            serializer = PED_EMI_Serializer(ped, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif modalidade == 'ProEJA':
            ped = get_object_or_404(PED_ProEJA, pk=pedId)
            serializer = PED_ProEJA_Serializer(ped, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Caso a modalidade não seja reconhecida
        return Response(
            {'mensagem': "Modalidade inválida. Use 'Integrado' ou 'ProEJA'."},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@permission_classes([GestaoEscolar])
def editar_PED(request, modalidade, pedId):
    try:
        data = request.data
        novo_professor_id = data.pop('professor_ped', None)

        if modalidade == 'Integrado':
            modelo = PED_EMI
            serializer_class = PED_EMI_Serializer
            professor_model = Professor_Progressao_EMI
            serializer_professor = Professor_PED_EMI_Serializer
        elif modalidade == 'ProEJA':
            modelo = PED_ProEJA
            serializer_class = PED_ProEJA_Serializer
            professor_model = Professor_Progressao_ProEJA
            serializer_professor = Professor_PED_ProEJA_Serializer
        else:
            raise Exception('Modalidade inválida')

        ped = get_object_or_404(modelo, pk=pedId)

        # Atualiza os dados principais da PED
        serializer_ped = serializer_class(ped, data=data)
        if not serializer_ped.is_valid():
            raise serializers.ValidationError(serializer_ped.errors)
        serializer_ped.save()

        # Cria o novo vínculo de professor responsável
        novo_professor_serializer = serializer_professor(data={
            'professor': novo_professor_id,
            'ped': ped.id,
            'responsavel_atual': True
        })

        if not novo_professor_serializer.is_valid():
            raise serializers.ValidationError(novo_professor_serializer.errors)

        novo_professor = novo_professor_serializer.save()  # salva o novo

        # Após salvar o novo, atualiza todos os outros para responsavel_atual=False
        professor_model.objects.filter(ped=ped).exclude(id=novo_professor.id).update(responsavel_atual=False)

        return Response(serializer_ped.data, status=status.HTTP_200_OK)

    except serializers.ValidationError as e:
        error_details = e.detail
        mensagens = []

        if isinstance(error_details, dict):
            for campo, erros in error_details.items():
                for erro in erros:
                    mensagens.append(f"{campo}: {str(erro)}")
        elif isinstance(error_details, list):
            for erro in error_details:
                mensagens.append(str(erro))
        else:
            mensagens.append(str(error_details))

        return Response({'mensagem': mensagens}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['PUT'])
@permission_classes([GestaoEscolar])
def desativar_PED(request, modalidade, pedId):
    try:
        if modalidade == 'Integrado':
            ped = get_object_or_404(PED_EMI, pk=pedId)
        elif modalidade == 'ProEJA':
            ped = get_object_or_404(PED_ProEJA, pk=pedId)
        
        ped.status = 'Desativado'
        ped.save()
        
        return Response({"message": "PED desativado com sucesso."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)
