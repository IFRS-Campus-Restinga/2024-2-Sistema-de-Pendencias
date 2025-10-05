def mapear_fk_para_objetos(obj_list, api_data_map, formato: str = 'obj'):
    """
    Substitui atributos FK do queryset pelos objetos recebidos da API.
    obj_list: lista de dicionários (ex: serializer.data)
    api_data_map: dict no formato {
        'obj': lista_obj
    }
    formato == 'flat': se True, remove o 'id' e deixa apenas o valor do primeiro campo disponível
    """
    resultado = []

    for obj in obj_list:
        item = obj.copy()  # já é dict, copia para não alterar o original

        for attr, lista_api in api_data_map.items():
            valor_fk = item.get(attr)

            if not valor_fk:
                continue

            # força sempre string
            fk_id = str(valor_fk.get('id')) if isinstance(valor_fk, dict) else str(valor_fk)

            # cria mapa indexado por string
            api_map_por_id = {str(dado['id']): dado for dado in lista_api if 'id' in dado}

            dado_api = api_map_por_id.get(fk_id)

            if dado_api:
                if formato == 'flat':
                    # pega o primeiro valor que não seja 'id'
                    for k, v in dado_api.items():
                        if k != 'id':
                            item[attr] = v
                            break
                else:
                    item[attr] = dado_api
            else:
                item[attr] = None

        resultado.append(item)

    return resultado
