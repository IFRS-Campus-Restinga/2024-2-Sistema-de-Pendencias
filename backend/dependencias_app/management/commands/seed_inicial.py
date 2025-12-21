import uuid
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

        # --- Vincular usuários ---
        self.stdout.write("\n👥 Vinculando usuários de gestão escolar...")

        usuarios_ges = [
            "3460bab9-579e-4f28-8524-efeeaf820991",
            "8bdae3d8-02b4-41a2-9c05-c04efd24929d",
        ]

        for user_uuid in usuarios_ges:
            user_uuid_obj = uuid.UUID(user_uuid)

            usuario, created = Usuario.objects.get_or_create(
                id=user_uuid_obj,
                defaults={"group": grupo}
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"🆕 Usuário {user_uuid} criado e vinculado ao grupo."
                    )
                )
            else:
                if force or usuario.group != grupo:
                    usuario.group = grupo
                    usuario.save()
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"🔁 Usuário {user_uuid} já existia. Grupo atualizado."
                        )
                    )
                else:
                    self.stdout.write(
                        f"ℹ️ Usuário {user_uuid} já estava no grupo correto."
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
