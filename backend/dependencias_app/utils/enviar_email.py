from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

def enviar_email(destinatario, template, assunto, grupo):
    url = settings.BASE_APP_URL

    try:
        corpo_email = render_to_string(template, context={'grupo': grupo, 'url': url})

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