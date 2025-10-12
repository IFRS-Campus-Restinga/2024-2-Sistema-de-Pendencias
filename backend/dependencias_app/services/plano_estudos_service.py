from ..utils.validar_modalidade import validar_modalidade

class PlanoEstudosService:
    @staticmethod
    def criar(data, modalidade):
        _, serializer_class = validar_modalidade(modalidade, "PlanoEstudos")