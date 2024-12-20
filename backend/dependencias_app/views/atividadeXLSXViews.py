from .models.atividadeXLSX import AtividadeXLSXResource
from rest_framework import generics
import pandas as pd
from tablib import Dataset

class AtividadeXLSXView(generics.CreateAPIView):
    arquivo = request.FILES['excel']
    df = pd.read_excel(arquivo)
    
    renomear_colunas = {
        'Título': 'titulo',
        'Descrição': 'descricao',
        'Nota': 'nota',
        'Data de Criação': 'data_criacao',
        'Data de Entrega': 'data_de_entrega',
        'Observações': 'observacoes'
    }
    
    df.rename(columns=renomear_colunas, inplace=True)

    # chama o model de atividade e cria uma instancia
    atividadexlsx_resource = AtividadeXLSXResource()
    
    dataset = Dataset().load(df)
        
    resultado = atividadexlsx_resource.import_data(dataset, dry_run=True, raise_errors=True)
    
    if not resultado.has_errors():
        resultado = atividadexlsx_resource.import_data(dataset, dry_run=False, raise_errors=True)
        return Response('Arquivo importado com sucesso!', status=status.HTTP_201_CREATED)
    
    return Response(resultado.errors, status=status.HTTP_400_BAD_REQUEST)