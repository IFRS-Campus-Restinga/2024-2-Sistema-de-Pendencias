from rest_framework.exceptions import ErrorDetail

def formatar_erros(erros: dict) -> list[str]:
    mensagens = []
    for campo, detalhes in erros.items():
        for detalhe in detalhes:
            # converte ErrorDetail para string se necessário
            mensagem = str(detalhe)
            mensagens.append(f"{campo}: {mensagem}")
    return mensagens
