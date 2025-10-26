from django.db import models
from .ped_proeja import PEDProEJA
from .form_encerramento import FormEncerramento

class FormEncerramentoProEJA(FormEncerramento):
    ped = models.OneToOneField(PEDProEJA, on_delete=models.DO_NOTHING, related_name='form_encerramento_proeja')

    class Meta:
        abstract = False
        verbose_name = "Form Encerramento ProEJA"
