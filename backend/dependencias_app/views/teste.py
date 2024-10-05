from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
def view_teste(request):
    mensagem = request.data.get('teste', None)

    if mensagem == None: return Response({'mensagem': 'A mensagem não é uma string'}, status=400)

    return Response({'mensagem': mensagem}, status=200)