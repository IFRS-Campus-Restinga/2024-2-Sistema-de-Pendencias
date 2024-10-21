import json
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission

class Command(BaseCommand):
    help = 'Exporta grupos e suas permissões associadas para um arquivo JSON'

    def handle(self, *args, **kwargs):
        data = []

        for group in Group.objects.all():
            group_data = {
                'model': 'auth.group',
                'pk': group.pk,
                'fields': {
                    'name': group.name,
                    'permissions': [perm.pk for perm in group.permissions.all()]
                }
            }
            data.append(group_data)

        with open('grupos_com_permissoes.json', 'w') as f:
            json.dump(data, f, indent=2)

        self.stdout.write(self.style.SUCCESS('Grupos e permissões exportados para grupos_com_permissoes.json com sucesso.'))
