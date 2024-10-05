from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
def teste_view(request):
    mensagem = request.data.get('mensagem', None)

    if mensagem == None: return Response({'mensagem': 'dados inválidos'}, status=400)

    return Response({'mensagem': mensagem}, status=200)

