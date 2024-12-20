import pandas as pd
from django.shortcuts import render
from django.views import View
from django.forms import ImportarDadosArquivo
from dependencias_app.models.uploadAtividade import UploadAtividade
from dependencias_app.permissoes import *

@api_view(['POST'])
@permission_classes([Professor])
def upload_atividade(request):
        arquivo = request.FILES['arquivo']
        if not arquivo.name.endswith('.xlsx'):
            return JsonResponse({'error': 'Por favor, envie um arquivo .xlsx válido.'}, status=400)
        
        required_columns = ["título", "descrição", "nota", "data de entrega", "observações"]
        if not all(col in df.columns for col in required_columns):
            return JsonResponse({'error': 'O arquivo deve conter as colunas: título, descrição, nota, data de entrega e observações.'}, status=400)

        df = pd.read_excel(arquivo)
        for index, row in df.iterrows():
            form = UploadAtividade(Título=row['Título'], Descrição=row['Descrição'], Nota=row['Nota'], Data_de_entrega=row['Data de entrega'], Observações=row['Observações'])
            form.save()
        return render(request)
        