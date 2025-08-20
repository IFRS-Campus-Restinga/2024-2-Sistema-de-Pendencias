import uuid
from django.db import models
from django.contrib.auth.models import Group
from .base import BaseModel

class GroupUUIDMap(BaseModel):
    group = models.OneToOneField(Group, on_delete=models.CASCADE, related_name="uuid_map")
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)