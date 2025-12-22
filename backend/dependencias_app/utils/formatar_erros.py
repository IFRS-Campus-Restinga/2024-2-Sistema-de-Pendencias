from rest_framework.exceptions import ErrorDetail

def formatar_erros(errors):
    """
    Converte ValidationError.detail em lista de strings do tipo:
    "campo: mensagem"
    """
    formatted = []

    if isinstance(errors, dict):
        for field, messages in errors.items():
            if isinstance(messages, (list, tuple)):
                for msg in messages:
                    if isinstance(msg, ErrorDetail):
                        msg = str(msg)
                    formatted.append(f"{field}: {msg}")
            else:
                msg = str(messages) if isinstance(messages, ErrorDetail) else messages
                formatted.append(f"{field}: {msg}")
    elif isinstance(errors, list):
        for item in errors:
            # Se for dict dentro da lista, processa igual dict
            if isinstance(item, dict):
                for field, messages in item.items():
                    if isinstance(messages, (list, tuple)):
                        for msg in messages:
                            if isinstance(msg, ErrorDetail):
                                msg = str(msg)
                            formatted.append(f"{field}: {msg}")
                    else:
                        msg = str(messages) if isinstance(messages, ErrorDetail) else messages
                        formatted.append(f"{field}: {msg}")
            else:
                if isinstance(item, ErrorDetail):
                    item = str(item)
                formatted.append(str(item))
    else:
        if isinstance(errors, ErrorDetail):
            errors = str(errors)
        formatted.append(str(errors))

    return formatted
