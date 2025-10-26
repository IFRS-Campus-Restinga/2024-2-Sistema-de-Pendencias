from google.oauth2 import service_account
from googleapiclient.discovery import build
from django.conf import settings

# Função para autenticar com a conta de serviço
def authenticate_google_drive(grupo):
    SCOPES = ['https://www.googleapis.com/auth/drive']

    # Define o arquivo de credenciais com base no grupo do usuário
    if grupo == 'gestao_escolar':
        SERVICE_ACCOUNT_FILE = f'{settings.BASE_DIR}/credentials/credentials_sistema.json'  # Caminho para o arquivo de credenciais do admin
    elif grupo in ['professor', 'coord']:
        SERVICE_ACCOUNT_FILE = f'{settings.BASE_DIR}/credentials/credentials_servidores.json'  # Caminho para o arquivo de credenciais dos professores/coordenadores
    elif grupo == 'aluno':
        SERVICE_ACCOUNT_FILE = f'{settings.BASE_DIR}/credentials/credentials_alunos.json'  # Caminho para o arquivo de credenciais dos professores/coordenadores
    else:
        raise ValueError("Grupo inválido. Permissões de grupo desconhecidas.")

    # Criação das credenciais da conta de serviço
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    service = build('drive', 'v3', credentials=credentials)
    return service
