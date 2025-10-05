class URLFieldsParser:
    @staticmethod
    def build_field_map(fields: list[str]) -> dict:
        """Constrói o mapa de campos aninhados a partir da lista de campos da URL."""
        field_map: dict = {}
        for field in fields:
            parts = field.split(".")
            current = field_map
            for part in parts[:-1]:
                current = current.setdefault(part, {})
            current[parts[-1]] = True
        return field_map

    @staticmethod
    def extract_fields(data: dict, field_map: dict) -> dict:
        """Extrai os campos do dicionário de acordo com o mapa de campos."""
        result = {}

        for field, subfields in field_map.items():
            if field not in data:
                result[field] = None
                continue

            value = data[field]

            # Lista de itens (ManyToMany / FK reverso)
            if isinstance(value, list):
                items = []
                for item in value:
                    if isinstance(subfields, dict) and isinstance(item, dict):
                        items.append(URLFieldsParser.extract_fields(item, subfields))
                    else:
                        items.append(item)  # mantém valor simples
                result[field] = items

            # Dicionário aninhado (FK/OneToOne)
            elif isinstance(value, dict) and isinstance(subfields, dict):
                result[field] = URLFieldsParser.extract_fields(value, subfields)

            # Campo simples
            else:
                result[field] = value

        return result

    @staticmethod
    def parse(data: dict, fields_param: str):
        """Recebe um dicionário e a string de campos da URL e retorna apenas os campos solicitados."""
        if not isinstance(data, dict):
            raise ValueError("URLFieldsParser.parse espera um dicionário como entrada.")

        fields = [f.strip() for f in fields_param.split(",") if f.strip()]
        field_map = URLFieldsParser.build_field_map(fields)
        return URLFieldsParser.extract_fields(data, field_map)
