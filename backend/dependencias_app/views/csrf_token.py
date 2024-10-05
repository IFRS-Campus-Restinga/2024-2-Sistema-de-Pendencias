from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from rest_framework.response import Response
from rest_framework.decorators import api_view

@csrf_exempt
@api_view(['GET'])
def csrf_token_view(request):
    token = get_token(request)
    return Response({'csrfToken': token})