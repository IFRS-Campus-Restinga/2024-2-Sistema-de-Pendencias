from collections import defaultdict
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from ..services.async_request_service import AsyncRequestService

base_url = settings.BASE_SYSTEM_URL
cookies = {"system": settings.API_KEY}

class NotificacaoService:

    @staticmethod
    def build_context(model):
        context = {}

        context["modalidade"] = ("Integrado" if model.__class__.__name__ == "PEDIntegrado" else "ProEJA")
        aluno_id = str(model.aluno.id)

        if context["modalidade"] == "Integrado":
            professor_id = next(str(p.professor.id) for p in model.professores_emi.all() if p.responsavel_atual)
        else:
            professor_id = next(str(p.professor.id) for p in model.professores_proeja.all() if p.responsavel_atual)
        
        tasks = [
            {"key": "aluno", "url": f"{base_url}/api/users/get/{aluno_id}/", "params": {"fields": "username"}},
            {"key": "professor", "url": f"{base_url}/api/users/get/{professor_id}/", "params": {"fields": "username"}},
        ]

        responses = AsyncRequestService.run_fetch(tasks, cookies=cookies)

        context["aluno"] = responses.get("aluno", {}).get("username")
        context["professor"] = responses.get("professor", {}).get("username")

        return context

    @staticmethod
    def criar_notificacao(destinatarios: list[dict], template_path: str, subject: str, model = None):
        tasks = []
        context_base = {
            'url': 'http://localhost:3000'
        }

        if model:
            context_base.update(NotificacaoService.build_context(model))

        for d in destinatarios:
            tasks.append({
                "key": f"{d['grupo']}:{d['id']}",
                "url": f"{base_url}/api/users/get/{d['id']}/",
                "params": {"fields": "email"}
            })

        responses = AsyncRequestService.run_fetch(tasks, cookies=cookies)

        emails_por_grupo = defaultdict(list)

        for key, user_data in responses.items():
            email = user_data.get("email")
            if not email:
                continue

            grupo, _ = key.split(":", 1)
            emails_por_grupo[grupo].append(email)

        for grupo, recipients in emails_por_grupo.items():
            if not recipients:
                continue

            context = context_base.copy()
            context["grupo"] = grupo

            html = render_to_string(template_path, context)

            NotificacaoService.enviar_email(
                recipients=recipients,
                subject=subject,
                html=html
            )

    @staticmethod
    def enviar_email(recipients: list[str], subject: str, html: str):
        email = EmailMultiAlternatives(
            subject=subject,
            body="Este email requer visualização em HTML",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=recipients,
        )
        email.attach_alternative(html, "text/html")
        email.send()
