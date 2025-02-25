import logging
from django.shortcuts import *
from dependencias_app.utils.manage_files import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.models.atividade import *
from dependencias_app.models.avaliacao import *
from dependencias_app.permissoes import *
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.serializers.atividadeSerializer import *
from dependencias_app.serializers.avaliacaoSerializer import *
from rest_framework.parsers import MultiPartParser, FormParser
from dependencias_app.enums.situacaoDependencia import SituacaoDependencia
from dependencias_app.enums.statusDependencia import StatusDependencia


@api_view(['POST'])
@permission_classes([Professor | GestaoEscolar])
def cadastrar_atividade(request, modalidade):
    data = request.data.copy()
    
    try:
        # Faz o upload do arquivo e obtém a URL
        if 'arquivo' in request.FILES:
            file = request.FILES.get('arquivo')
            data['drive_id'] = upload_to_drive(file, file.name, request.user.grupo.name)

        # Seleciona o serializer conforme a modalidade
        if modalidade == "Integrado":
            serializer = Atividade_EMI_Serializer(data=data)
        elif modalidade == "ProEJA":
            serializer = Atividade_ProEJA_Serializer(data=data)
        else: 
            raise Exception('Modalidade inválida')

        # Verifica se os dados enviados são válidos
        if not serializer.is_valid():
            raise Exception(f'Erro de validação: {serializer.errors}')

        # Salva a atividade no banco de dados
        serializer.save()

        return Response({'message': 'Atividade cadastrada com sucesso!'}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        # Retorna erro genérico em caso de falha
        return Response({"mensagem": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([Professor | Aluno | GestaoEscolar])
def buscar_atividade(request, modalidade, atividadeId):
    try:
        if modalidade == 'Integrado':
            atividade = get_object_or_404(Atividade_EMI, pk=atividadeId)

            serializer = Atividade_EMI_Serializer(atividade, context={'request': request})
        elif modalidade == 'ProEJA':
            atividade = get_object_or_404(Atividade_ProEJA, pk=atividadeId)

            serializer = Atividade_ProEJA_Serializer(atividade, context={'request': request})
        else:
            raise Exception('Modalidade inválida')
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([Professor | GestaoEscolar | Coordenador | Aluno])
def listar_atividades(request, pedId, modalidade):
    try:        
        # Busca o PED (emi ou proeja) a partir do tipo e ID
        if modalidade == "Integrado":
            atividades = Avaliacao_Atividade_EMI.objects.filter(ped=pedId).order_by('data_criacao')

            serializer = Avaliacao_EMI_Serializer(atividades, many=True, context={'request': request})
        elif modalidade == "ProEJA":
            atividades = Avaliacao_Atividade_ProEJA.objects.filter(ped=pedId).order_by('data_criacao')

            serializer = Avaliacao_ProEJA_Serializer(atividades, many=True, context={'request': request})
        else: 
            raise Exception('Modalidade inválida')

        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        # Retorna erro genérico em caso de falha
        return Response({"mensagem": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([Professor])
def vincular_atividades(request, pedId, modalidade):
    try:
        avaliacoes = request.data.get('avaliacoes', [])
        atividades = [avaliacao['atividade'] for avaliacao in avaliacoes]

        if modalidade == 'Integrado':
            ped = get_object_or_404(PED_EMI, pk=pedId)
            modelo = Avaliacao_Atividade_EMI
            serializer_class = Avaliacao_EMI_Serializer
        elif modalidade == 'ProEJA':
            ped = get_object_or_404(PED_ProEJA, pk=pedId)
            modelo = Avaliacao_Atividade_ProEJA
            serializer_class = Avaliacao_ProEJA_Serializer
        else:
            raise Exception('Modalidade Inválida')
        
        # Excluir avaliações que não estão na nova lista
        avaliacoes_existentes = modelo.objects.filter(ped=ped)
        avaliacoes_existentes.exclude(atividade_id__in=atividades).delete()

        # Criar ou atualizar avaliações
        for avaliacao in avaliacoes:            
            serializer = serializer_class(data=avaliacao)

            if not serializer.is_valid(): raise Exception(serializer.errors)

            # Verifica se já existe uma avaliação com essa atividade
            avaliacao_obj, created = modelo.objects.update_or_create(
                ped=ped,
                atividade_id=avaliacao['atividade'],
                defaults={'data_entrega': avaliacao['data_entrega'], 'nota': avaliacao.get('nota', None)}
            )

            if not created:
                avaliacao_obj.status = 'Avaliada'
                avaliacao_obj.save()

        return Response({'mensagem': 'Plano de atividades salvo com sucesso!'}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([Professor])
def listar_atividades_professor(request):
    lista_emi = lista_proeja = []

    modalidade = request.GET.get('modalidade', None)

    try:
        if modalidade == 'Integrado' or modalidade == '':
            atividades_emi = Atividade_EMI.objects.filter(professor=request.user)
            serializer_emi = Atividade_EMI_Serializer(atividades_emi, many=True, context={'request': request})
            
            lista_emi = getattr(serializer_emi, 'data', [])
            print(lista_emi)

        if modalidade == 'ProEJA' or modalidade == '':
            atividades_proeja = Atividade_ProEJA.objects.filter(professor=request.user)
            serializer_proeja = Atividade_ProEJA_Serializer(atividades_proeja, many=True, context={'request': request})

            lista_proeja = getattr(serializer_proeja, 'data', [])

        return Response(lista_emi + lista_proeja, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'mensagem': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([Professor])
def editar_atividade(request, modalidade, atividadeId):
    data = request.data.copy()
    try:
        if modalidade == 'Integrado':
            atividade = get_object_or_404(Atividade_EMI, pk=atividadeId)
            serializer = Atividade_EMI_Serializer
        elif modalidade == 'ProEJA':
            atividade = get_object_or_404(Atividade_ProEJA, pk=atividadeId)
            serializer = Atividade_ProEJA_Serializer
        else: raise Exception('Modalidade inválida')

        if 'arquivo' in request.FILES:
            file = request.FILES.get('arquivo')
            data['drive_id'] = change_file(file, file.name, atividade.drive_id, request.user.grupo.name)

        
        atividade_serializer = serializer(atividade, data=data)
        if not atividade_serializer.is_valid(): raise Exception(serializer.errors)
            
        atividade_serializer.save()
        return Response({'mensagem': 'Atividade atualizada com sucesso!'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['PUT'])
@permission_classes([Professor])
def atualizar_nota_final(request, ped_tipo, ped_id):
    try:
        nota_final = request.data.get('nota_final')
        if nota_final is None:
            return Response({"erro": "Nota final não fornecida."}, status=status.HTTP_400_BAD_REQUEST)

        if ped_tipo == "emi":
            ped = PED_EMI.objects.filter(id=ped_id).first()
        elif ped_tipo == "proeja":
            ped = PED_ProEJA.objects.filter(id=ped_id).first()
        else:
            return Response({"erro": "Tipo de PED inválido."}, status=status.HTTP_400_BAD_REQUEST)

        if not ped:
            return Response({"erro": "PED não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        if ped.professor_ped != request.user:
            return Response({"erro": "Acesso não autorizado."}, status=status.HTTP_403_FORBIDDEN)

        ped.nota_final = nota_final
        if nota_final >= 7:
            ped.situacao = SituacaoDependencia.APROVADO
        else:
            ped.situacao = SituacaoDependencia.REPROVADO
        ped.status = StatusDependencia.FINALIZADO
        ped.save()

        return Response({"nota_final": ped.nota_final}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([Professor | GestaoEscolar | Coordenador])
def exibir_nota_final(request, ped_tipo, ped_id):
    try:
        if ped_tipo == "emi":
            ped = PED_EMI.objects.filter(id=ped_id).first()
        elif ped_tipo == "proeja":
            ped = PED_ProEJA.objects.filter(id=ped_id).first()
        else:
            return Response({"erro": "Tipo de PED inválido."}, status=status.HTTP_400_BAD_REQUEST)

        if not ped:
            return Response({"erro": "PED não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Permitir acesso para Gestão Escolar ou professor responsável
        if not request.user.has_perm('GestaoEscolar') and ped.professor_ped != request.user:
            return Response({"erro": "Acesso não autorizado"}, status=status.HTTP_403_FORBIDDEN)

        nota_final = ped.nota_final
        situacao = ped.situacao
        status_dep = ped.status

        return Response(
            {
                "nota_final": nota_final,
                "situacao": situacao,
                "status": status_dep,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        logging.error(f"Erro ao exibir nota final: {str(e)}")
        return Response(
            {"erro": f"Erro inesperado: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )    

@api_view(['GET'])
@permission_classes([Professor | GestaoEscolar])
def detalhes_atividade(request, ped_tipo, ped_id, atividade_id):
    try:
        if ped_tipo == "emi":
            atividade = Atividade_EMI.objects.filter(id=atividade_id).first()
            serializer_class = Atividade_EMI_Serializer
        elif ped_tipo == "proeja":
            atividade = Atividade_ProEJA.objects.filter(id=atividade_id).first()
            serializer_class = Atividade_ProEJA_Serializer
        else:
            return Response({"erro": "Tipo de PED inválido."}, status=status.HTTP_400_BAD_REQUEST)

        if not atividade:
            return Response({"erro": "Atividade não encontrada."}, status=status.HTTP_404_NOT_FOUND)

        ped = atividade.ped_emi if ped_tipo == "emi" else atividade.ped_proeja

        # Permitir acesso para Gestão Escolar ou professor responsável
        if not request.user.has_perm('GestaoEscolar') and ped.professor_ped != request.user:
            return Response({"erro": "Acesso não autorizado"}, status=status.HTTP_403_FORBIDDEN)

        serializer = serializer_class(atividade)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@permission_classes([Professor])
def adicionar_plano_atividades(request, ped_tipo, ped_id):
    parser_classes = (MultiPartParser, FormParser)

    try:
        if ped_tipo == "emi":
            ped = PED_EMI.objects.filter(id=ped_id).first()
            if not ped:
                return Response({"erro": "PED EMI não encontrado"}, status=status.HTTP_404_NOT_FOUND)

            if ped.professor_ped != request.user:
                return Response({"erro": "Acesso não autorizado"}, status=status.HTTP_403_FORBIDDEN)

            plano_atividades = request.FILES.get('plano_atividades')
            if plano_atividades:
                if plano_atividades.content_type != 'application/pdf':
                    return Response({"erro": "O arquivo não é um PDF"}, status=status.HTTP_400_BAD_REQUEST)

                if plano_atividades.size > 5 * 1024 * 1024:  # 5MB
                    return Response({"erro": "O arquivo é muito grande. O tamanho máximo permitido é 5MB."}, status=status.HTTP_400_BAD_REQUEST)

                try:
                    # Verificar se já existe um plano de atividades
                    if ped.plano_atividades:
                        ped.plano_atividades.delete()  # Excluir o plano anterior, se existir

                    # Atualizar ou criar o novo plano de atividades
                    ped.plano_atividades = plano_atividades
                    ped.save()

                    return Response({"mensagem": "Plano de atividades salvo com sucesso"}, status=status.HTTP_201_CREATED)

                except Exception as e:
                    return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            else:
                return Response({"erro": "Plano de atividades não anexado"}, status=status.HTTP_400_BAD_REQUEST)

        elif ped_tipo == "proeja":
            ped = PED_ProEJA.objects.filter(id=ped_id).first()
            if not ped:
                return Response({"erro": "PED ProEJA não encontrado"}, status=status.HTTP_404_NOT_FOUND)

            if ped.professor_ped != request.user:
                return Response({"erro": "Acesso não autorizado"}, status=status.HTTP_403_FORBIDDEN)

            plano_atividades = request.FILES.get('plano_atividades')
            if plano_atividades:
                if plano_atividades.content_type != 'application/pdf':
                    return Response({"erro": "O arquivo não é um PDF"}, status=status.HTTP_400_BAD_REQUEST)

                if plano_atividades.size > 5 * 1024 * 1024:  # 5MB
                    return Response({"erro": "O arquivo é muito grande. O tamanho máximo permitido é 5MB."}, status=status.HTTP_400_BAD_REQUEST)

                try:
                    # Verificar se já existe um plano de atividades
                    if ped.plano_atividades:
                        ped.plano_atividades.delete()  # Excluir o plano anterior, se existir

                    # Atualizar ou criar o novo plano de atividades
                    ped.plano_atividades = plano_atividades
                    ped.save()

                    return Response({"mensagem": "Plano de atividades salvo com sucesso"}, status=status.HTTP_201_CREATED)

                except Exception as e:
                    return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            else:
                return Response({"erro": "Plano de atividades não anexado"}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['DELETE'])
@permission_classes([Professor])
def delete_atividade(request, ped_tipo, ped_id, atividade_id):
    try:
        # Verifica se o tipo de ped é valido
        if ped_tipo not in ['emi', 'proeja']:
            return Response({"erro": "Tipo de PED inválido."}, status=status.HTTP_400_BAD_REQUEST)

        # Retorna atividade baseado no ped_tipo e atividade_id
        if ped_tipo == "emi":
            atividade = Atividade_EMI.objects.filter(id=atividade_id).first()
        elif ped_tipo == "proeja":
            atividade = Atividade_ProEJA.objects.filter(id=atividade_id).first()

        # Verifica se a atividade existe
        if not atividade:
            return Response({"erro": "Atividade não encontrada."}, status=status.HTTP_404_NOT_FOUND)

        # Verifica se o professor logado é o responsável pelo PED da atividade
        ped = atividade.ped_emi if ped_tipo == "emi" else atividade.ped_proeja
        if ped.professor_ped != request.user:
            return Response({"erro": "Acesso não autorizado."}, status=status.HTTP_403_FORBIDDEN)

        # Deleta a atividade
        atividade.delete()

        return Response({"mensagem": "Atividade deletada com sucesso."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)