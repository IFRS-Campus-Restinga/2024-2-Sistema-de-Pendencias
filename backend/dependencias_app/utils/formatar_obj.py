def formatar_obj(obj, formato: str = 'obj'):
    """
    Substitui atributos FK de um único objeto pelos valores das requests.

    obj: dict representando o PED, com os campos já preenchidos pelos resultados das requests
    formato: 'flat' -> retorna valor simples se dict tiver 2 chaves (uma 'id'), ou dict sem 'id' se tiver mais
             'obj' -> mantém o objeto completo
    """
    def achar_valor(d):
        if not isinstance(d, dict) or 'id' not in d:
            return d

        if formato != 'flat':
            return d

        # Se tiver apenas 2 chaves, retorna o valor que não é 'id'
        if len(d) == 2 and 'id' in d:
            for k, v in d.items():
                if k != 'id':
                    return v

        # Se tiver mais de 2 chaves, retorna dict sem id
        resultado = {k: v for k, v in d.items() if k != 'id'}

        # Aplica recursivamente se algum valor for dict ou lista de dicts
        for k, v in resultado.items():
            if isinstance(v, dict):
                resultado[k] = achar_valor(v)
            elif isinstance(v, list) and v and isinstance(v[0], dict):
                resultado[k] = [achar_valor(i) for i in v]

        return resultado

    item = obj.copy()

    for attr, valor in item.items():
        if isinstance(valor, dict) and 'id' in valor:
            item[attr] = achar_valor(valor)
        elif isinstance(valor, list) and valor and isinstance(valor[0], dict):
            item[attr] = [achar_valor(v) for v in valor]

    return item
