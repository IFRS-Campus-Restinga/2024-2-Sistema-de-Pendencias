def extrair_campos_para_retorno(retorno: str, atributo: str) -> str:
    campos = [campo.strip() for campo in retorno.split(',')]  # <-- strip aqui
    campos_filtrados = [
        campo.split('.', 1)[1]
        for campo in campos
        if campo.startswith(f"{atributo}.")
    ]
    return ','.join(campos_filtrados)