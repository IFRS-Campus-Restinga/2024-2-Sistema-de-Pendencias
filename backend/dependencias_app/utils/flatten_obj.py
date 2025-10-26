def flatten_named_fields(data, keys=('name', 'username', 'start')):
    """
    Sobe os campos internos 'name', 'username' ou 'start' para o nível superior.
    Mantém o resto dos campos como estão.
    """
    result = {}
    for key, value in data.items():
        if isinstance(value, dict):
            # Procura o primeiro campo relevante dentro do dicionário
            found = next((value[k] for k in keys if k in value), None)
            result[key] = found if found is not None else flatten_named_fields(value, keys)
        else:
            result[key] = value
    return result
