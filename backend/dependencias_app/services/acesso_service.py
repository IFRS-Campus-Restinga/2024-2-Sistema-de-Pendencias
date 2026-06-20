import uuid
import requests
from django.conf import settings
from dependencias_app.models.professor_progressao import ProfessorProgressaoIntegrado, ProfessorProgressaoProeja
from dependencias_app.utils.validar_modalidade import validar_modalidade
from dependencias_session.services.token_service import TokenService
from django.db.models import OuterRef, Subquery, UUIDField

class AcessoException(Exception):
    pass

class AcessoService:
    @staticmethod
    def validar_acesso(request, modalidade, ped_id):
        ped_model_class, _ = validar_modalidade(modalidade, 'PED')

        payload = TokenService.decode_token(request.COOKIES.get(settings.AUTH_COOKIE_NAME))

        if modalidade == "Integrado":
            responsavel_subquery = ProfessorProgressaoIntegrado.objects.filter(
                ped=OuterRef('pk'),
                responsavel_atual=True
            ).values('professor')[:1]
        else:
            responsavel_subquery = ProfessorProgressaoProeja.objects.filter(
                ped=OuterRef('pk'),
                responsavel_atual=True
            ).values('professor')[:1]

        ped = ped_model_class.objects.annotate(
            professor_ped=Subquery(responsavel_subquery, output_field=UUIDField())
        ).get(id=uuid.UUID(ped_id))

        if payload['group'] == 'professor':
            if payload['user_id'] != str(ped.professor_ped):
                raise AcessoException('Acesso não autorizado')
            
        if payload['group'] == 'aluno':
            if payload['user_id'] != str(ped.aluno.id):
                raise AcessoException('Acesso não autorizado')

        if payload['group'] == 'coord':
            res = requests.get(
                f"{settings.BASE_SYSTEM_URL}/api/academic/courses/get/{str(ped.curso)}/",
                params={"fields": "coord.id"},
                cookies={'system': settings.API_KEY}
            ).json()

            coord = res.get("coord")

            if not coord:
                raise AcessoException("Curso sem coordenador ou retorno inválido da API")
            
            coord_id = coord.get("id")

            if payload['user_id'] != str(coord_id):
                raise AcessoException('Acesso não autorizado')

        return payload, ped
