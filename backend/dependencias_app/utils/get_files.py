import base64
import io
from google_auth.services.authenticate_drive import authenticate_google_drive
from googleapiclient.http import MediaIoBaseDownload

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
            "data": encoded_image
        }

    except Exception as e:
        raise Exception(f"Erro ao tentar obter o arquivo: {str(e)}")
