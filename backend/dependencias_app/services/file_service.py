from django.template.loader import render_to_string
from weasyprint import HTML
import io
import base64

class FileService:
    @staticmethod
    def gerar_pdf(template_name, context):
        """
        Gera PDF a partir de um template Django HTML e retorna bytes.
        """
        html_string = render_to_string(template_name, context)
        pdf_file = io.BytesIO()

        HTML(string=html_string).write_pdf(pdf_file)
        pdf_file.seek(0)
        
        return pdf_file