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
        grupo, created = Group.objects.get_or_create(name='gestao_escolar')
        if created:
            print(f"✅ Grupo gestao_escolar criado.")
        else:
            print(f"ℹ️ Grupo gestao_escolar já existia.")

        # --- Permissões ---
        todas_permissoes = Permission.objects.all()

        # Admin recebe todas as permissões
        ge_group = Group.objects.get(name="gestao_escolar")
        ge_group.permissions.set(todas_permissoes)
        ge_group.save()
        print(f"🔐 Grupo 'gestao_escolar' recebeu {todas_permissoes.count()} permissões.")

        # --- Vincular usuário existente ao grupo admin ---
        try:
            Usuario.objects.create(id=uuid.UUID("8a32b245-16a4-4281-8f5a-52b950d7c350"), group=ge_group)
        except Exception as e:
            print(f"❌ Erro ao criar usuário: {e}")

        # --- Mapeamento de UUIDs de grupos e permissões ---
        print("📊 Mapeando UUIDs de grupos e permissões...")

        for grupo in Group.objects.all():
            uuid_map, criado = GroupUUIDMap.objects.get_or_create(group=grupo)
            status = "🆕" if criado else "🔁"
            print(f"{status} Grupo '{grupo.name}' UUID: {uuid_map.uuid}")

        for perm in todas_permissoes:
            uuid_map, criado = PermissionUUIDMap.objects.get_or_create(permission=perm)
            status = "🆕" if criado else "🔁"
            print(f"{status} Permissão '{perm.codename}' UUID: {uuid_map.uuid}")

        print("✅ Mapeamento de UUIDs concluído.")

    # --- Subir servidor Django ---
    print("🌍 Subindo servidor Django em localhost:8080 ...")
    run_command([sys.executable, "manage.py", "runserver", "localhost:8080"])


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n🛑 Execução interrompida pelo usuário.")
