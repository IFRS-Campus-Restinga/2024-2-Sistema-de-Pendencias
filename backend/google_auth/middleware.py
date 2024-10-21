from django.contrib.sessions.middleware import SessionMiddleware

class CustomSessionMiddleware(SessionMiddleware):
    def process_request(self, request):
        # Tenta obter o `sessionid` do cabeçalho X-Session-ID
        session_id = request.headers.get('X-Session-ID')
        if session_id:
            request.COOKIES[self.cookie_name] = session_id
        
        # Continua com o processamento normal da sessão
        super().process_request(request)
