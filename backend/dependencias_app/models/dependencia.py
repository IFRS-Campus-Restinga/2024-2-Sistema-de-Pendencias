from django.core.validators import MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from .base import *  

class Dependencia(BaseModel):  


    class EnumStatus(models.TextChoices):
        ATIVO = 'AT', 'Ativo'
        INATIVO = 'IN', 'Inativo'
        FINALIZADO = 'FI', 'Finalizado'
        CANCELADO = 'CA', 'Cancelado'

    status = models.CharField(
        max_length=2,
        choices=EnumStatus.choices,
        default=EnumStatus.ATIVO,
        verbose_name="Status",
        help_text="Selecione o status do registro",
        blank=False,
        null=False
    )
    
    datainicio = models.DateField(
        verbose_name="Data de Início",
        help_text="Data de início da Dependencia",
        blank=False,
        null=False
    )
    
    datafim = models.DateField(
        verbose_name="Data de Fim",
        help_text="Data de termino da Dependencia",
        blank=False,
        null=False
    )
    
    notafinal = models.FloatField(
        verbose_name="Nota Final",
        help_text="Nota final da Dependencia",
        blank=True, #Definido como não obrigatorio para não interferir nos cadastros
        null=True,
        validators=[MaxValueValidator(10.0)]  # Exemplo de validação, ajuste conforme necessário
    )
    
    situacao = models.CharField(
        max_length=255,
        verbose_name="Situação",
        help_text="Descrição da situação",
        blank=True, #Definido como não obrigatorio para não interferir nos cadastros
        null=True
    )
    
    observacao = models.TextField(
        verbose_name="Observação",
        help_text="Observações adicionais",
        blank=True,
        null=True
    )

    class Meta:
        abstract = False


    def clean(self):
        super().clean()
        
        # Validação: a data de início não pode ser posterior à data de fim
        if self.datainicio > self.datafim:
            raise ValidationError("A data de início não pode ser posterior à data de fim.")
        
        # Validação: a data de início não pode ser menor que a data atual
        if self.datainicio < timezone.now().date():
            raise ValidationError("A data de início não pode ser anterior à data atual.")    

    def __str__(self):
        return f"{self.status} - {self.datainicio} a {self.datafim} - Nota: {self.notafinal}"
