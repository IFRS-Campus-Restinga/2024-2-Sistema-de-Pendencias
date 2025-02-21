import { useEffect, useState } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import './VisualizarPDF.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString();

const PDFPreview = ({ pdfData }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const renderPDF = async () => {
        const byteString = atob(pdfData)
      try {
        // Carregar o PDF a partir do ArrayBuffer
        const pdf = await getDocument({ data: byteString }).promise;
        const page = await pdf.getPage(1); // Pega a primeira página

        const scale = 1.5; // Escala da renderização (quanto maior, mais nítida)
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Ajusta o tamanho do canvas conforme a viewport da página
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Renderiza a página no canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Converte o canvas para uma URL de imagem (data URL)
        const image = canvas.toDataURL();
        setImageUrl(image); // Define a URL da imagem gerada
      } catch (error) {
        console.error('Erro ao carregar o PDF:', error);
      }
    };

    renderPDF();
  }, [pdfData]);

  const openFullPDF = () => {
    const pdfUrl = URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }));
    window.open(pdfUrl, '_blank'); // Abre o PDF em uma nova aba
  };

  if (!imageUrl) {
    return <FontAwesomeIcon icon={faSpinner} spin color='#006b3f'/>
  }

  return (
      <div
        className="pdfPreview"
        onClick={openFullPDF}
      >
        <div style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            width: '200px',
            height: '300px'
        }}/>
    </div>
  );
};

export default PDFPreview;
