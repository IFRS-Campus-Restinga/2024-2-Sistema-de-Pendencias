import os
import requests
import threading
from django.conf import settings
from django.core.management.base import BaseCommand
from datetime import date, datetime, timedelta
from dependencias_app.models.ped_integrado import PEDIntegrado
from dependencias_app.models.ped_proeja import PEDProeja
from dependencias_app.models.professor_progressao import ProfessorProgressaoIntegrado, ProfessorProgressaoProeja
from dependencias_app.services.notificacao_service import NotificacaoService
from dependencias_app.models.ppt import PPT
from dependencias_app.models.usuario import Usuario

cookies = {'system': settings.API_KEY}
base_url = settings.BASE_SYSTEM_URL
template_path = os.path.join(settings.BASE_DIR, "dependencias_app", "templates_email", "conselhoDeClasse.html")

class Command(BaseCommand):
    help = "Executa rotinas automáticas de consulta a calendários e eventos"

    def handle(self, *args, **options):
        self.stdout.write("Iniciando rotina de consulta a calendários e eventos")

        self.verificar_conselho_classe()
        self.verificar_calendario_academico()

        self.stdout.write("Rotina finalizada com sucesso")

    def verificar_conselho_classe(self):
        hoje = datetime.today().date()

        eventos = requests.get(
            f"{settings.BASE_SYSTEM_URL}/api/calendars/events/get/", 
            params={
                'month': hoje.month, 
                'year': hoje.year,
                'fields': 'start, type, category'
            },
            cookies=cookies
        ).json()

        conselho_integrado = None
        conselho_proeja = None

        for evento in eventos:
            if evento.get('type') != 'Conselhos de classe':
                continue

            start_date = datetime.strptime(evento['start'], '%Y-%m-%d').date()

            if start_date - hoje != timedelta(days=7):
                continue

            if evento.get('category') == 'Integrado':
                conselho_integrado = evento
            elif evento.get('category') == 'ProEJA':
                conselho_proeja = evento

        if conselho_integrado:
            professores_integrado = ProfessorProgressaoIntegrado.objects.filter(
                responsavel_atual=True,
                ped__status="Em Andamento"
            ).distinct()

            if professores_integrado.exists():
                destinatarios_integrado = [
                    {'id': str(p.professor.id), 'grupo': 'Professor'}
                    for p in professores_integrado
                ]

                ped = professores_integrado.first().ped

                NotificacaoService.criar_notificacao(destinatarios_integrado, template_path, "Conselho de classe EMI", ped)

                self.stdout.write("Conselho de classe do EMI daqui 7 dias, notificações emitidas.")
    
        if conselho_proeja:
            professores_proeja = ProfessorProgressaoProeja.objects.filter(
                responsavel_atual=True,
                ped__status="Em Andamento"
            ).distinct()

            if professores_proeja.exists():
                destinatarios_proeja = [
                    {'id': str(p.professor.id), 'grupo': 'Professor'}
                    for p in professores_proeja
                ]

                ped = professores_proeja.first().ped

                NotificacaoService.criar_notificacao(destinatarios_proeja, template_path, "Conselho de classe ProEJA", ped)

                self.stdout.write("Conselho de classe do ProEJA daqui 7 dias, notificações emitidas.")

    def verificar_calendario_academico(self):
        hoje = date.today()

        calendarios = requests.get(
            f'{settings.BASE_SYSTEM_URL}/api/calendars/get/',
            params={
                'status': 'Ativo',
                'fields': 'start,end',
            },
            cookies={
                'system': settings.API_KEY
            }
        ).json().get('results')

        if not calendarios:
            return

        calendario_mais_recente = max(calendarios, key=lambda c: c['end'])

        data_fim = date.fromisoformat(calendario_mais_recente['end'])

        usuarios_cre = Usuario.objects.filter(group__name='coord_reg_esc')
        destinatarios = []
        for usuario in usuarios_cre:
            destinatarios.append({'id': usuario.id, 'grupo': 'Coord. Reg. Esc.'})

        NotificacaoService.criar_notificacao(destinatarios, template_path, "Encerramento do período letivo")

        self.stdout.write("Notificações emitidas para Coord. Reg. Esc.")

        if data_fim == hoje:
            PPT.objects.filter(status="Em Andamento").update(status="Lançada")

        self.stdout.write("Status das PPTs atualizado de 'Em Andamento' para 'Lançada'.")
