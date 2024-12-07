from django.core.mail import send_mail
from django.template.loader import render_to_string
import os
from django.conf import settings

def enviar_email(destinatario, template, assunto, grupo):
    try:
        corpo_email = render_to_string(template, context={'nome': destinatario.nome, 'grupo': grupo})

        send_mail(
        subject=assunto,
        message="",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[destinatario.email],
        html_message=corpo_email,
        fail_silently=False,
        )

    except Exception as e:
        raise e