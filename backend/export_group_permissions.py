import os
import django
import json

# Configurações do Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import Group, Permission

def export_groups_and_permissions(filename='grupos_permissoes.json'):
    data = []
    
    # Percorrer todos os grupos
    for group in Group.objects.all():
        group_data = {
            'group_name': group.name,
            'permissions': []
        }
        
        # Obter permissões associadas ao grupo
        for permission in group.permissions.all():
            permission_data = {
                'codename': permission.codename,
                'name': permission.name,
                'content_type': f"{permission.content_type.app_label}.{permission.content_type.model}"
            }
            group_data['permissions'].append(permission_data)
        
        data.append(group_data)
    
    # Exportar para um arquivo JSON
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)
    
    print(f"Grupos e permissões exportados para {filename}")

if __name__ == '__main__':
    export_groups_and_permissions()
