from django.apps import AppConfig
from django.db.models.signals import post_migrate, post_save


class DependenciasAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'dependencias_app'

    def ready(self):
        from django.contrib.auth.models import Permission
        from dependencias_app.models.permission_map import PermissionUUIDMap

        def sync_permission_uuids(sender, **kwargs):
            """
            Executa após cada migração:
            - remove permissões indesejadas
            - sincroniza UUIDs com a tabela PermissionUUIDMap
            """
            unwanted_models = {'session', 'logentry', 'contenttype', 'user'}

            # 1️⃣ Remove permissões desnecessárias
            Permission.objects.filter(content_type__model__in=unwanted_models).delete()

            # 2️⃣ Cria UUIDs para permissões válidas que ainda não têm mapping
            for perm in Permission.objects.all():
                PermissionUUIDMap.objects.get_or_create(permission=perm)

            # 3️⃣ Remove mappings órfãos (cuja permissão foi deletada)
            PermissionUUIDMap.objects.exclude(permission__in=Permission.objects.all()).delete()

        # Executa sincronização completa após migração
        post_migrate.connect(sync_permission_uuids, sender=self)

        # 4️⃣ Garante sincronização automática sempre que uma permissão nova for criada
        def create_uuid_on_permission_create(sender, instance, created, **kwargs):
            if created:
                PermissionUUIDMap.objects.get_or_create(permission=instance)

        post_save.connect(create_uuid_on_permission_create, sender=Permission)
