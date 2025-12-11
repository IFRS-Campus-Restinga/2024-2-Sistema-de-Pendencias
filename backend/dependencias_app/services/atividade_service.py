import uuid
from rest_framework import serializers
from ..models.usuario import Usuario
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from ..utils.manage_files import upload_to_drive, get_from_drive, change_file
from ..utils.validar_modalidade import validar_modalidade
from django.conf import settings
from dependencias_session.services.token_service import TokenService

class AtividadePagination(PageNumberPagination):
    page_query_param = 'pagina'
    page_size = 10
    page_size_query_param = 'tam_pagina'
    max_page_size = 30

DRIVE_FOLDER = settings.DRIVE_ATIVIDADES_FOLDER

class AtividadeService:
    @staticmethod
    def validar_professor(request):
        usuario_id = TokenService.decode_token(request.COOKIES.get("access_token")).get('user_id')

        professor = Usuario.objects.filter(id=usuario_id, group__name='professor').first()

        if professor is None:
            raise serializers.ValidationError("Usuário inválido")
        
        return professor

    @staticmethod
    def criar(request, modalidade):
        _, serializer_class = validar_modalidade(modalidade, 'Atividade')
        professor = AtividadeService.validar_professor(request)

        data = request.data.copy()
        data['professor'] = str(professor.id)

        arquivos = request.FILES

        if arquivos:
            arquivo = arquivos.get('arquivo')
            if arquivo:
                drive_id = upload_to_drive(
                    arquivo,
                    file_name=request.data.get('titulo'),
                    grupo=professor.group.name,
                    parents=DRIVE_FOLDER
                )

                data['drive_id'] = drive_id

        serializer = serializer_class(data=data)
        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)

        serializer.save()

    @staticmethod
    def listar(request, modalidade):
        model_class, serializer_class = validar_modalidade(modalidade, 'Atividade')

        professor = AtividadeService.validar_professor(request)

        if professor is None:
            raise serializers.ValidationError("Grupo inválido")
        
        atividades = model_class.objects.filter(professor=professor)

        paginator = AtividadePagination()
        resultado_paginado = paginator.paginate_queryset(atividades, request)

        if resultado_paginado is None or not atividades.exists():
            return paginator.get_paginated_response([])

        serializer = serializer_class(resultado_paginado, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)

    @staticmethod
    def detalhes(request, modalidade, atividade_id):
        model_class, serializer_class = validar_modalidade(modalidade, 'Atividade')

        atividade = get_object_or_404(model_class, pk=uuid.UUID(atividade_id))

        grupo = TokenService.decode_token(request.COOKIES.get("access_token")).get("group")

        serializer = serializer_class(atividade, context={'request': request})
        data = dict(serializer.data)

        if atividade.drive_id:
            file = get_from_drive(
                atividade.drive_id,
                grupo
            )
            data['arquivo'] = file  # 🔹 adiciona o conteúdo base64 do arquivo

        return data

    @staticmethod
    def editar(request, modalidade, atividade_id):
        model_class, serializer_class = validar_modalidade(modalidade, 'Atividade')
        professor = AtividadeService.validar_professor(request)

        atividade = get_object_or_404(model_class, pk=uuid.UUID(atividade_id), professor=professor)

        data = request.data.copy()
        data['professor'] = str(professor.id)

        arquivos = request.FILES

        if arquivos:
            arquivo = arquivos.get('arquivo')
            if arquivo:
                if atividade.drive_id:
                    drive_id = change_file(
                        arquivo,
                        file_name=request.data.get('titulo'),
                        previous_file_id=atividade.drive_id,
                        grupo=professor.group.name,
                        parents=DRIVE_FOLDER
                    )
                else:
                    drive_id = upload_to_drive(
                        file=arquivo,
                        file_name=request.data.get('titulo'),
                        grupo=professor.group.name,
                        parents=DRIVE_FOLDER
                    )

                data['drive_id'] = drive_id

        serializer = serializer_class(data=data, instance=atividade)
        if not serializer.is_valid():
            raise serializers.ValidationError(serializer.errors)

        serializer.save()