from django.db import models
from .ped_proeja import PEDProeja
from .form_encerramento import FormEncerramento

class FormEncerramentoProeja(FormEncerramento):
    ped = models.OneToOneField(PEDProeja, on_delete=models.DO_NOTHING, related_name='form_encerramento_proeja')

    class Meta:
        abstract = False
        verbose_name = "Form Encerramento ProEJA"
