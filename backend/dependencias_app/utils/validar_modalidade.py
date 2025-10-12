from rest_framework import serializers
from importlib import import_module

def validar_modalidade(modalidade: str, tipo: str):
    """
    Retorna dinamicamente o Model e o Serializer de acordo com a modalidade e o tipo.
    Exemplo:
        validar_modalidade("Integrado", "PED")
        validar_modalidade("ProEJA", "PlanoEstudos")
    """
    modalidade = modalidade.capitalize()  # garante "Integrado" ou "ProEJA"

    try:
        # importa dinamicamente o model
        models_module = import_module(f"dependencias_app.models.{tipo.lower()}_{modalidade.lower()}")
        model_class = getattr(models_module, f"{tipo}{modalidade}")

        # importa dinamicamente o serializer
        serializers_module = import_module(f"dependencias_app.serializers.{tipo.lower()}_{modalidade.lower()}_serializer")
        serializer_class = getattr(serializers_module, f"{tipo}{modalidade}Serializer")

        return model_class, serializer_class

    except (ModuleNotFoundError, AttributeError) as e:
        raise serializers.ValidationError({
            "erro": f"Tipo ou modalidade inválido: {tipo}-{modalidade}. Detalhes: {str(e)}"
        })
