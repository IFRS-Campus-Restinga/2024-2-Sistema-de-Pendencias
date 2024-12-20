from import_export import resources
from dependencias_app.models.atividade import Atividade

class AtividadeXLSXResource(resources.ModelResource):
    class Meta:
        model = Atividade
        import_id_fields = ('titulo', 'descricao', 'nota', 'data_criacao', 'data_de_entrega', 'observacoes')
        skip_unchanged = True
        use_bulk = True