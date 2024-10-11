from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
def view_teste(request):
    mensagem = request.data.get('mensagem', None)

    if mensagem == None: return Response({'mensagem': 'dados inválidos'}, status=400)

    return Response({'mensagem': mensagem}, status=200)


@api_view(['GET'])
def get_status(request):
    return JsonResponse({'status': 'ok'}, status=200)