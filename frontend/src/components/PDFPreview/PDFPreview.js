import { useEffect, useState } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import './PDFPreview.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import downloadBranco from '../../assets/upload-branco.png'

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString();

const PDFPreview = ({ pdfData }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [PDF, setPDF] = useState(null)
  const [pdfURL, setPdfURL] = useState(null)
  const [paginasPDF, setPaginasPDF] = useState([])
  const [pdfAberto, setPdfAberto] = useState(false)
  const [download, setDownload] = useState(false)

  const base64_ArrayBuffer = (base64) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const arquivo_ArrayBuffer = async (arquivo) => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result));
      reader.onerror = reject;
      reader.readAsArrayBuffer(arquivo); // Lê o arquivo como ArrayBuffer
    });
  }

  const renderPreview = async () => {
    let byteArray

    if (pdfData instanceof File) {
      byteArray = await arquivo_ArrayBuffer(pdfData)
    } else {
      byteArray = base64_ArrayBuffer(pdfData)
    }

    const byteArrayCopy = byteArray.slice(0);

    try {
      // Carregar o PDF a partir do ArrayBuffer
      const pdf = await getDocument({ data: byteArrayCopy }).promise;
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

      setImageUrl(canvas.toDataURL()); // Define a URL da imagem gerada
      setPDF(byteArray)
    } catch (error) {
      console.error('Erro ao carregar o PDF:', error);
    }
  };

  const renderPDF = async () => {
    try {
      const pdfCopy = PDF.slice(0)

      const pdf = await getDocument({ data: pdfCopy }).promise;
      const numPages = pdf.numPages;
  
      const pagesArray = [];
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum); // Pega a página do PDF
        const scale = 1; // Escala da renderização (quanto maior, mais nítida)
        const viewport = page.getViewport({ scale });
  
        // Cria um canvas para cada página
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
  
        canvas.width = viewport.width;
        canvas.height = viewport.height;
  
        // Renderiza a página no canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
  
        // Adiciona a URL da imagem gerada no array de páginas
        pagesArray.push(canvas.toDataURL());
      }
  
      setPaginasPDF(pagesArray);

      const blob = new Blob([PDF], { type: "application/pdf" })

      setPdfURL(URL.createObjectURL(blob))
    } catch (error) {
      console.error('Erro ao carregar o PDF:', error);
    }
  }

  useEffect(() => {
    setImageUrl(null)
    renderPreview();

    if (pdfURL) URL.revokeObjectURL(pdfURL);

  }, [pdfData]);

  useEffect(() => {
    if (PDF) renderPDF()
  }, [PDF])

  useEffect(() => {
  },[pdfURL])

  if (!pdfData) {
    return <FontAwesomeIcon icon={faSpinner} spin color='#006b3f'/>
  }

  return (
    <>
      <div
        className="pdfPreview" onClick={() => setPdfAberto(true)}>
        <div style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            width: '220px',
            height: '300px',
            border: '1px dashed #006b3f'
        }}/>
    </div>
    {
      pdfAberto ? (
        <div className='viewContainer' onClick={() => setPdfAberto(false)}>
            <img src={downloadBranco} className='downloadIcon' style={{display: `${download ? 'block' : 'none'}`}}/>
          <a href={pdfURL} className={`pdfContainer ${download ? 'download' : ''}`} download={'Atividade.pdf'} onMouseEnter={() => setDownload(true)} onMouseLeave={() => setDownload(false)}>
            {
              paginasPDF.map((pagina) => (
                <img src={pagina} className='pdf'/>
              ))
            }
          </a>
        </div>
      ) : <></>
    }
    </>
  );
};

export default PDFPreview;
