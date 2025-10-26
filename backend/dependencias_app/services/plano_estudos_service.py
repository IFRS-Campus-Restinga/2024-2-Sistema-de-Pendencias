import os
import uuid
import base64
from datetime import datetime
from rest_framework import serializers
from ..utils.validar_modalidade import validar_modalidade
from ..utils.flatten_obj import flatten_named_fields
from ..utils.manage_files import upload_to_drive
from django.conf import settings
from django.db.models import OuterRef, Subquery, UUIDField
from django.forms.models import model_to_dict
from ..models.ped_integrado import PEDIntegrado
from ..models.ped_proeja import PEDProEJA
from ..models.professor_progressao import ProfessorProgressaoIntegrado, ProfessorProgressaoProEJA
from .async_request_service import AsyncRequestService
from .file_service import FileService
from dependencias_session.services.token_service import TokenService

DRIVE_FOLDER = settings.DRIVE_PLANO_ESTUDOS_FOLDER
cookies = {"system": settings.API_KEY}
base_url = settings.BASE_SYSTEM_URL
logo_path = os.path.join(settings.BASE_DIR, "dependencias_app", "templates_pdf", "logo-ifrs-colorido.png")

class PlanoEstudosService:
    @staticmethod
    def criar(request, modalidade):
        _, serializer_class = validar_modalidade(modalidade, "PlanoEstudos")
        ped_model_class = PEDIntegrado if modalidade == 'Integrado' else PEDProEJA

        data = request.data.copy()

        # Define a subquery conforme a modalidade
        if modalidade == "Integrado":
            responsavel_subquery = (
                ProfessorProgressaoIntegrado.objects
                .filter(ped=OuterRef('pk'), responsavel_atual=True)
                .values('professor')[:1]
            )
        else:
            responsavel_subquery = (
                ProfessorProgressaoProEJA.objects
                .filter(ped=OuterRef('pk'), responsavel_atual=True)
                .values('professor')[:1]
            )

        ped = (
            ped_model_class.objects
            .annotate(professor_ped=Subquery(responsavel_subquery, output_field=UUIDField()))
            .get(id=uuid.UUID(data.get("ped")))
        )

        tasks = [
            {"key": "aluno", "url": f"{base_url}/api/users/get/{str(ped.aluno.id)}/", "params": {"fields": "username"}},
            {"key": "professor_ped", "url": f"{base_url}/api/users/get/{str(ped.professor_ped)}/", "params": {"fields": "username"}},
            {"key": "curso", "url": f"{base_url}/api/academic/courses/get/{str(ped.curso)}/", "params": {"fields": "name"}},
            {"key": "disciplina", "url": f"{base_url}/api/academic/subjects/get/{str(ped.disciplina)}/", "params": {"fields": "name"}},
            {"key": "periodo_letivo", "url": f"{base_url}/api/calendars/get/{str(ped.periodo_letivo)}/", "params": {"fields": "start"}},
        ]

        try:
            # executa todas as requests simultaneamente
            dados_ped = AsyncRequestService.run_fetch(tasks, cookies=cookies)

            ped_dict = model_to_dict(ped)

            ped_dict.update(dados_ped)

            context_plano_estudos = flatten_named_fields({**ped_dict, **data}, ('name', 'username', 'start'))
            context_plano_estudos['ano'] = datetime.strptime(context_plano_estudos['periodo_letivo'], "%Y-%m-%d").year
            context_plano_estudos['logo'] = context_plano_estudos['logo'] = f"file:///{logo_path.replace(os.sep, '/')}"

            file = FileService.gerar_pdf('templates/parecer_inicial.html', context_plano_estudos)
            file.seek(0)
            pdf_base64 = base64.b64encode(file.read()).decode("utf-8")

            file.seek(0)
            data['drive_id'] = upload_to_drive(
                file,
                f'parecer_inicial_{context_plano_estudos.get("ped")}',
                TokenService.decode_token(request.COOKIES.get("access_token")).get("group"),
                DRIVE_FOLDER
            )

            serializer = serializer_class(data=data)
            if not serializer.is_valid():
                raise serializers.ValidationError(serializer.errors)
            serializer.save()

            return pdf_base64
        except Exception as e:
            raise Exception(f"Erro ao buscar dados do PED {ped.id}: {str(e)}")



