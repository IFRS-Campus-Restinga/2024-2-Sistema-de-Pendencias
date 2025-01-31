from google_auth.services.authenticate_drive import authenticate_google_drive

def get_from_drive(file_id, grupo):
    try:
        # Autentica usando a conta de serviço correspondente
        service = authenticate_google_drive(grupo)
        
        # Cria o arquivo no Google Drive
        return service.files().get_media(fileId=file_id)

    except Exception as e:
        # Retorna a mensagem de erro se algo falhar
        print(f"Erro ao tentar fazer upload: {str(e)}")
        raise Exception(f"Erro ao tentar fazer upload: {str(e)}")
