import logging
from django.http import FileResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from dependencias_app.models.atividade import *
from dependencias_app.models.pedEMI import PED_EMI
from dependencias_app.models.pedProEJA import PED_ProEJA
from dependencias_app.serializers.atividadeSerializer import *
from dependencias_app.permissoes import Professor
from rest_framework.parsers import MultiPartParser, FormParser


@api_view(['GET'])
@permission_classes([Professor])
def listar_atividades(request, ped_tipo, ped_id):
    if ped_tipo == "emi":
        ped = PED_EMI.objects.filter(id=ped_id).first()
        if not ped:
            return Response({"erro": "PED EMI não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # Checa se o professor logado é o responsável pela PED
        if ped.professor_ped != request.user:
            return Response({"erro": "Acesso não autorizado"}, status=status.HTTP_403_FORBIDDEN)
        
        atividades = Atividade_EMI.objects.filter(ped_emi=ped)
        for atividade in atividades:
            atividade.aluno = ped.aluno  # Adiciona o aluno do PED à atividade

        serializer = Atividade_EMI_Serializer(atividades, many=True)

    elif ped_tipo == "proeja":
        ped = PED_ProEJA.objects.filter(id=ped_id).first()
        if not ped:
            return Response({"erro": "PED ProEJA não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        if ped.professor_ped != request.user:
            return Response({"erro": "Acesso não autorizado"}, status=status.HTTP_403_FORBIDDEN)
        
        atividades = Atividade_ProEJA.objects.filter(ped_proeja=ped)
        for atividade in atividades:
            atividade.aluno = ped.aluno  # Adiciona o aluno do PED à atividade

        serializer = Atividade_ProEJA_Serializer(atividades, many=True)

    else:
        return Response({"erro": "Tipo de PED inválido"}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.data, status=status.HTTP_200_OK)


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
        ped.save()

        return Response({"nota_final": ped.nota_final}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([Professor])
def adicionar_atividade(request, ped_tipo, ped_id):
    try:
        # Busca o PED (emi ou proeja) a partir do tipo e ID
        if ped_tipo == "emi":
            ped = PED_EMI.objects.filter(id=ped_id).first()
        elif ped_tipo == "proeja":
            ped = PED_ProEJA.objects.filter(id=ped_id).first()
        else:
            return Response({"erro": "Tipo de PED inválido."}, status=status.HTTP_400_BAD_REQUEST)

        # Se o PED não for encontrado, retornar erro
        if not ped:
            return Response({"erro": "PED não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Verificar se o professor logado é o responsável pelo PED
        if ped.professor_ped != request.user:
            return Response({"erro": "Acesso não autorizado."}, status=status.HTTP_403_FORBIDDEN)

        # Verifica qual serializer usar
        if ped_tipo == 'emi':
            serializer = Atividade_EMI_Serializer(data=request.data)
        elif ped_tipo == 'proeja':
            serializer = Atividade_ProEJA_Serializer(data=request.data)

        # Verifica se os dados enviados são válidos
        if serializer.is_valid():
            # Salva a atividade associando ao PED correspondente
            if ped_tipo == 'emi':
                atividade = serializer.save(ped_emi=ped)  # Passa o PED_EMI
            elif ped_tipo == 'proeja':
                atividade = serializer.save(ped_proeja=ped)  # Passa o PED_ProEJA

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Retorna os erros de validação
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        # Retorna erro genérico em caso de falha
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
@permission_classes([Professor])
def detalhes_atividade(request, ped_tipo, ped_id, atividade_id):
    print(f"atividade_id: {atividade_id}")  # imprime o valor de atividade_id
    try:
        # Verifica o tipo de PED e busca a atividade correspondente
        if ped_tipo == "emi":
            atividade = Atividade_EMI.objects.filter(id=atividade_id).first()
        elif ped_tipo == "proeja":
            atividade = Atividade_ProEJA.objects.filter(id=atividade_id).first()
        else:
            return Response({"erro": "Tipo de PED inválido."}, status=status.HTTP_400_BAD_REQUEST)

        print(f"atividade: {atividade}")  # imprime o resultado da busca
        if not atividade:
            return Response({"erro": "Atividade não encontrada."}, status=status.HTTP_404_NOT_FOUND)

        # Determina o PED correspondente à atividade
        ped = atividade.ped_emi if ped_tipo == "emi" else atividade.ped_proeja
        
        # Verifica se o professor logado é o responsável pelo PED da atividade
        if ped.professor_ped != request.user:
            return Response({"erro": "Acesso não autorizado."}, status=status.HTTP_403_FORBIDDEN)

        # Serializa a atividade e retorna os detalhes
        serializer_class = Atividade_EMI_Serializer if ped_tipo == "emi" else Atividade_ProEJA_Serializer
        serializer = serializer_class(atividade)
        print(f"serializer.data: {serializer.data}")  # imprime o resultado da serialização
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['PUT'])
@permission_classes([Professor])
def editar_atividade(request, ped_tipo, ped_id, atividade_id):
    try:
        if ped_tipo == "emi":
            atividade = Atividade_EMI.objects.filter(id=atividade_id).first()
        elif ped_tipo == "proeja":
            atividade = Atividade_ProEJA.objects.filter(id=atividade_id).first()
        else:
            return Response({"erro": "Tipo de PED inválido."}, status=status.HTTP_400_BAD_REQUEST)

        if not atividade:
            return Response({"erro": "Atividade não encontrada."}, status=status.HTTP_404_NOT_FOUND)

        ped = atividade.ped_emi if ped_tipo == "emi" else atividade.ped_proeja
        if ped.professor_ped != request.user:
            return Response({"erro": "Acesso não autorizado."}, status=status.HTTP_403_FORBIDDEN)

        # Usa o serializer adequado
        if ped_tipo == "emi":
            serializer = Atividade_EMI_Serializer(atividade, data=request.data, partial=True)  # "partial=True" para permitir update de campos
        else:
            serializer = Atividade_ProEJA_Serializer(atividade, data=request.data, partial=True)

        if serializer.is_valid():
            # A validação pode incluir 'nota' se for update, ou excluir caso contrário
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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