from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomPayLoad(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['idUsuario'] = user.id
        token['perfil'] = user.grupo.name
        token['primeiroNome'] = user.first_name
        token['ultimoNome'] = user.last_name

        return token
