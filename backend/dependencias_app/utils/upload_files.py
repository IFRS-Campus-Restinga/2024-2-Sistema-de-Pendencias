from googleapiclient.http import MediaIoBaseUpload
from google_auth.services.authenticate_drive import authenticate_google_drive
import io

def upload_to_drive(file, file_name, grupo):
    try:
        # Verifica se o grupo tem permissão para fazer upload
        if grupo == 'Aluno':
            raise Exception('Permissão de grupo inválida para upload')

        # Autentica usando a conta de serviço correspondente
        service = authenticate_google_drive(grupo)

        # Define os metadados do arquivo
        file_metadata = {
            'name': file_name,
            'parents': ['1ClTW88YusBkt1Gt0i7ZHdW9qcBc50ldG']  # ID da pasta de destino no Google Drive
        }
        
        media = MediaIoBaseUpload(io.BytesIO(file.read()), mimetype='application/pdf')

        # Cria o arquivo no Google Drive
        uploaded_file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()

        return uploaded_file.get('id')

    except Exception as e:
        # Retorna a mensagem de erro se algo falhar
        print(f"Erro ao tentar fazer upload: {str(e)}")
        raise Exception(f"Erro ao tentar fazer upload: {str(e)}")
