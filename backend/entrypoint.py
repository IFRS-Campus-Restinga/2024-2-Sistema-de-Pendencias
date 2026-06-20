import os
import sys
import uuid
import threading
import time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

from django.conf import settings
from django.db import transaction
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.management import call_command
from dependencias_app.models.usuario import Usuario
from dependencias_app.models.group_map import GroupUUIDMap
from dependencias_app.models.permission_map import PermissionUUIDMap

CRON_INTERVAL_SECONDS = 86400  # 24h


MODELOS_SEM_PERMISSAO = [
    ("admin", "logentry"),
    ("sessions", "session"),
    ("auth", "user"),
    ("dependencias_app", "usuario"),
]


@transaction.atomic
def seed_inicial():
    print("🧹 Removendo permissões de modelos internos...")

    for app_label, model in MODELOS_SEM_PERMISSAO:
        try:
            ct = ContentType.objects.get(app_label=app_label, model=model)
            count, _ = Permission.objects.filter(content_type=ct).delete()
            if count:
                print(f"   🗑️  {app_label}.{model}: {count} permissões removidas")
        except ContentType.DoesNotExist:
            pass

    print("\n⚙️ Criando grupos e vinculando permissões...")

    grupo, created = Group.objects.get_or_create(name="gestao_escolar")

    if created:
        print("✅ Grupo gestao_escolar criado.")
    else:
        print("ℹ️ Grupo gestao_escolar já existia.")

    todas_permissoes = Permission.objects.all()

    if grupo.permissions.count() != todas_permissoes.count():
        grupo.permissions.set(todas_permissoes)
        grupo.save()
        print(f"🔐 Grupo 'gestao_escolar' recebeu {todas_permissoes.count()} permissões.")
    else:
        print("ℹ️ Permissões já estavam configuradas.")

    print("\n👥 Vinculando usuário raíz de gestão escolar...")

    root_user_uuid = settings.ROOT_USER

    try:
        user_uuid_obj = uuid.UUID(root_user_uuid)
    except ValueError:
        raise ValueError(f"ROOT_USER '{root_user_uuid}' não é um UUID válido.")

    usuario, created = Usuario.objects.get_or_create(
        id=user_uuid_obj,
        defaults={"group": grupo, "is_active": True}
    )

    if created:
        print(f"🆕 Usuário raíz {root_user_uuid} criado e vinculado ao grupo gestao_escolar.")
    else:
        updated_fields = []
        if usuario.group != grupo:
            usuario.group = grupo
            updated_fields.append("group")
        if not usuario.is_active:
            usuario.is_active = True
            updated_fields.append("is_active")
        if updated_fields:
            usuario.save(update_fields=updated_fields)
            print(f"🔁 Usuário raíz {root_user_uuid} atualizado: {', '.join(updated_fields)}.")
        else:
            print(f"ℹ️ Usuário raíz {root_user_uuid} já estava no grupo correto e ativo.")

    print("\n📊 Mapeando UUIDs de grupos e permissões...")

    for grp in Group.objects.all():
        uuid_map, criado = GroupUUIDMap.objects.get_or_create(group=grp)
        status = "🆕" if criado else "🔁"
        print(f"{status} Grupo '{grp.name}' UUID: {uuid_map.uuid}")

    for perm in todas_permissoes:
        uuid_map, criado = PermissionUUIDMap.objects.get_or_create(permission=perm)
        status = "🆕" if criado else "🔁"
        print(f"{status} Permissão '{perm.codename}' UUID: {uuid_map.uuid}")

    print("\n✅ Seed inicial concluído com sucesso.")


def _loop_rotina_calendarios():
    while True:
        try:
            call_command('rotina_calendarios')
        except Exception as e:
            print(f"[rotina_calendarios] Erro: {e}", file=sys.stderr)
        time.sleep(CRON_INTERVAL_SECONDS)


if __name__ == '__main__':
    seed_inicial()

    t = threading.Thread(target=_loop_rotina_calendarios, daemon=True)
    t.start()
    print(f"🕐 Cron rotina_calendarios iniciado (intervalo: {CRON_INTERVAL_SECONDS}s).")

    call_command('runserver', '0.0.0.0:8001')
