import os
import django
import json

# Configurações do Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import Group

def export_groups_and_permissions(filename='grupos_permissoes.json'):
    data = []
    
    # Percorrer todos os grupos
    for group in Group.objects.all():
        group_data = {
            'model': 'auth.group',
            'pk': group.id,
            'fields': {
                'name': group.name,
                'permissions': [perm.id for perm in group.permissions.all()]
            }
        }
        
        # Adicionar o grupo aos dados exportados
        data.append(group_data)
    
    # Exportar para um arquivo JSON
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)
    
    print(f"Grupos e permissões exportados para {filename}")

if __name__ == '__main__':
    export_groups_and_permissions()
