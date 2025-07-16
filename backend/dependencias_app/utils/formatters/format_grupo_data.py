from django.contrib.auth.models import Group

class FormatGrupoData:
    @staticmethod
    def list_format(instance: Group):
        formatted_name = instance.name.replace('_', ' ').title()

        return {
            'id': instance.uuid_map.uuid,
            'nome': formatted_name,
        }
    
    @staticmethod
    def details_format(group: Group):
        return {
            'id': group.uuid_map.uuid,
            'name': group.name,
            'permissions': []
        }