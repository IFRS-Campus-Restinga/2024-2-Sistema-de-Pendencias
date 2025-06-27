import base64
import io
from dependencias_app.utils.authenticate_drive import authenticate_google_drive
from googleapiclient.http import MediaIoBaseDownload, MediaIoBaseUpload

def get_from_drive(file_id, grupo):
    try:
        service = authenticate_google_drive(grupo)

        # Obtém os metadados do arquivo (incluindo nome)
        file_metadata = service.files().get(fileId=file_id, fields="name").execute()
        file_name = file_metadata.get("name", "arquivo_desconhecido")

        # Obtém os bytes do arquivo do Drive
        request = service.files().get_media(fileId=file_id)
        file_stream = io.BytesIO()
        downloader = MediaIoBaseDownload(file_stream, request)

        done = False
        while not done:
            _, done = downloader.next_chunk()

        file_stream.seek(0)
        encoded_image = base64.b64encode(file_stream.read()).decode('utf-8')

        # Retorna o nome do arquivo junto com o Base64
        return {
            "name": file_name,
            "data": encoded_image,
        }

    except Exception as e:
        raise Exception(f"Erro ao tentar obter o arquivo: {str(e)}")


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
    
def change_file(file, file_name, previous_file_id, grupo):
    try:
        # Verifica se o grupo tem permissão para fazer upload
        if grupo == 'Aluno':
            raise Exception('Permissão de grupo inválida para upload')

        # Autentica usando a conta de serviço correspondente
        service = authenticate_google_drive(grupo)

        previous_file = service.files().delete(fileId=previous_file_id).execute()

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
