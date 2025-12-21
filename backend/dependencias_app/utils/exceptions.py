from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError

def custom_exception_handler(exc, context):
    """
    Intercepta erros de UUID malformado lançados pelo Django ORM
    e converte para mensagens de validação amigáveis.
    """

    # 1️⃣ UUID inválido (ValueError do Django)
    if isinstance(exc, ValueError) and "badly formed hexadecimal UUID" in str(exc):
        request = context.get("request")

        errors = {}

        if request and hasattr(request, "data"):
            for field, value in request.data.items():
                if value in ("", None):
                    errors[field] = ["Valor inválido"]

        if errors:
            return exception_handler(
                ValidationError(errors),
                context
            )

        return exception_handler(
            ValidationError("Valor inválido"),
            context
        )

    # 2️⃣ Demais erros padrão do DRF
    return exception_handler(exc, context)
