from django.db import models
from .ped_integrado import PEDIntegrado
from .form_encerramento import FormEncerramento

class FormEncerramentoIntegrado(FormEncerramento):
    ped = models.OneToOneField(PEDIntegrado, on_delete=models.DO_NOTHING, related_name='form_encerramento_emi')

    class Meta:
        abstract = False
        verbose_name = "Form Encerramento EMI"
