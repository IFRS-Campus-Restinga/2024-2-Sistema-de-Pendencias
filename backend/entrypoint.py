import os
import subprocess
import sys
import django
import uuid

def run_command(command: list[str]):
    """Executa um comando e exibe a saída em tempo real."""
    print(f"\n👉 Rodando comando: {' '.join(command)}")
    result = subprocess.run(command)
    if result.returncode != 0:
        print(f"❌ Erro ao executar: {' '.join(command)}")
        sys.exit(result.returncode)

def main():
    print("⚙️ Criando grupos e vinculando permissões...")

    # Configura o ambiente Django
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    django.setup()

    from django.contrib.auth.models import Group, Permission
    from dependencias_app.models.usuario import Usuario
    from dependencias_app.models.group_map import GroupUUIDMap
    from dependencias_app.models.permission_map import PermissionUUIDMap
    from django.db import transaction

    with transaction.atomic():
        # --- Grupo gestão escolar ---
        grupo, created = Group.objects.get_or_create(name='gestao_escolar')
        if created:
            print(f"✅ Grupo gestao_escolar criado.")
        else:
            print(f"ℹ️ Grupo gestao_escolar já existia.")

        # --- Permissões ---
        todas_permissoes = Permission.objects.all()

        # Grupo recebe todas as permissões
        ge_group = Group.objects.get(name="gestao_escolar")
        ge_group.permissions.set(todas_permissoes)
        ge_group.save()
        print(f"🔐 Grupo 'gestao_escolar' recebeu {todas_permissoes.count()} permissões.")

        print("\n👥 Vinculando usuários de gestão escolar...")

        usuarios_ges = [
            "3460bab9-579e-4f28-8524-efeeaf820991",
            "8bdae3d8-02b4-41a2-9c05-c04efd24929d"
        ]

        for user_uuid in usuarios_ges:
            user_uuid_obj = uuid.UUID(user_uuid)

            usuario, created = Usuario.objects.get_or_create(
                id=user_uuid_obj,
                defaults={"group": ge_group}
            )

            if created:
                print(f"🆕 Usuário {user_uuid} criado e vinculado ao grupo gestao_escolar.")
            else:
                # Atualiza o grupo caso já exista
                usuario.group = ge_group
                usuario.save()
                print(f"🔁 Usuário {user_uuid} já existia. Grupo atualizado.")

        # --- Mapeamento de UUIDs de grupos e permissões ---
        print("\n📊 Mapeando UUIDs de grupos e permissões...")

        for grupo in Group.objects.all():
            uuid_map, criado = GroupUUIDMap.objects.get_or_create(group=grupo)
            status = "🆕" if criado else "🔁"
            print(f"{status} Grupo '{grupo.name}' UUID: {uuid_map.uuid}")

        for perm in todas_permissoes:
            uuid_map, criado = PermissionUUIDMap.objects.get_or_create(permission=perm)
            status = "🆕" if criado else "🔁"
            print(f"{status} Permissão '{perm.codename}' UUID: {uuid_map.uuid}")

        print("\n✅ Mapeamento de UUIDs concluído.")

    # --- Subir servidor Django ---
    print("\n🌍 Subindo servidor Django em localhost:8080 ...")
    run_command([sys.executable, "manage.py", "runserver", "localhost:8080"])


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n🛑 Execução interrompida pelo usuário.")
