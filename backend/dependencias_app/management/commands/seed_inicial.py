import uuid
from django.conf import settings
from django.db import transaction
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from dependencias_app.models.usuario import Usuario
from dependencias_app.models.group_map import GroupUUIDMap
from dependencias_app.models.permission_map import PermissionUUIDMap


class Command(BaseCommand):
    help = "Cria o grupo gestão escolar, vincula permissões, usuários e mapeia UUIDs"

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Força recriação dos vínculos mesmo se já existirem"
        )

    @transaction.atomic
    def handle(self, *args, **options):
        force = options.get("force", False)

        self.stdout.write("⚙️ Criando grupos e vinculando permissões...")

        # --- Grupo gestão escolar ---
        grupo, created = Group.objects.get_or_create(name="gestao_escolar")

        if created:
            self.stdout.write(self.style.SUCCESS("✅ Grupo gestao_escolar criado."))
        else:
            self.stdout.write(self.style.WARNING("ℹ️ Grupo gestao_escolar já existia."))

        # --- Permissões ---
        todas_permissoes = Permission.objects.all()

        if force or grupo.permissions.count() != todas_permissoes.count():
            grupo.permissions.set(todas_permissoes)
            grupo.save()
            self.stdout.write(
                self.style.SUCCESS(
                    f"🔐 Grupo 'gestao_escolar' recebeu {todas_permissoes.count()} permissões."
                )
            )
        else:
            self.stdout.write("ℹ️ Permissões já estavam configuradas.")

        # --- Vincular usuário raíz ---
        self.stdout.write("\n👥 Vinculando usuário raíz de gestão escolar...")

        root_user_uuid = settings.ROOT_USER

        try:
            user_uuid_obj = uuid.UUID(root_user_uuid)
        except ValueError:
            raise ValueError(f"ROOT_USER '{root_user_uuid}' não é um UUID válido.")

        usuario, created = Usuario.objects.get_or_create(
            id=user_uuid_obj,
            defaults={"group": grupo}
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS(
                    f"🆕 Usuário raíz {root_user_uuid} criado e vinculado ao grupo gestao_escolar."
                )
            )
        else:
            if force or usuario.group != grupo:
                usuario.group = grupo
                usuario.save()
                self.stdout.write(
                    self.style.SUCCESS(
                        f"🔁 Usuário raíz {root_user_uuid} já existia. Grupo atualizado para gestao_escolar."
                    )
                )
            else:
                self.stdout.write(
                    f"ℹ️ Usuário raíz {root_user_uuid} já estava no grupo correto."
                )

        # --- Mapeamento de UUIDs ---
        self.stdout.write("\n📊 Mapeando UUIDs de grupos e permissões...")

        for grp in Group.objects.all():
            uuid_map, criado = GroupUUIDMap.objects.get_or_create(group=grp)
            status = "🆕" if criado else "🔁"
            self.stdout.write(
                f"{status} Grupo '{grp.name}' UUID: {uuid_map.uuid}"
            )

        for perm in todas_permissoes:
            uuid_map, criado = PermissionUUIDMap.objects.get_or_create(permission=perm)
            status = "🆕" if criado else "🔁"
            self.stdout.write(
                f"{status} Permissão '{perm.codename}' UUID: {uuid_map.uuid}"
            )

        self.stdout.write(self.style.SUCCESS("\n✅ Seed de gestão escolar concluído com sucesso."))
