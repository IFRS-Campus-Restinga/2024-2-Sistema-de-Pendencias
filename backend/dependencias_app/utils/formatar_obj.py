def formatar_obj(obj, formato: str = 'obj', ignorar_campo=None):
    """
    Substitui atributos FK de um único objeto pelos valores das requests.

    obj: dict representando o PED, com os campos já preenchidos pelos resultados das requests
    formato: 'flat' -> retorna valor simples se dict tiver 2 chaves (uma 'id'), ou dict sem 'id' se tiver mais
             'obj' -> mantém o objeto completo

    ignorar_campo:
        - nome de um campo a NÃO modificar
        - ou lista de campos
    """

    # Normaliza para lista
    if isinstance(ignorar_campo, str):
        ignorar_campo = [ignorar_campo]
    elif ignorar_campo is None:
        ignorar_campo = []

    def achar_valor(d):
        # Se não for dict ou não tiver id, retorna como está
        if not isinstance(d, dict) or 'id' not in d:
            return d

        # Se formato não for flat, retorna o dict intacto
        if formato != 'flat':
            return d

        # Caso 1: apenas id + um campo → retorna esse campo
        if len(d) == 2:
            for k, v in d.items():
                if k != 'id':
                    return v

        # Caso 2: mais campos → remove id
        resultado = {k: v for k, v in d.items() if k != 'id'}

        # Processa recursivamente
        for k, v in resultado.items():
            if k in ignorar_campo:
                continue  # mantém campo intacto

            if isinstance(v, dict):
                resultado[k] = achar_valor(v)

            elif isinstance(v, list) and v and isinstance(v[0], dict):
                resultado[k] = [achar_valor(i) for i in v]

        return resultado

    item = obj.copy()

    for attr, valor in item.items():
        if attr in ignorar_campo:
            continue  # mantém sem mexer

        if isinstance(valor, dict) and 'id' in valor:
            item[attr] = achar_valor(valor)

        elif isinstance(valor, list) and valor and isinstance(valor[0], dict):
            item[attr] = [achar_valor(v) for v in valor]

    return item

