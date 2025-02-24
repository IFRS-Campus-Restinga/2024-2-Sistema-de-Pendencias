import { useEffect, useState } from 'react';
import './VisualizarPDF.css'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString()

const VisualizarPDF = ({ pdfData, onClick }) => {
    const [paginasPDF, setPaginasPDF] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const renderPDF = async () => {
        
      };

    useEffect(() => {
        console.log(pdfData)
        if (pdfData) renderPDF();
      }, [pdfData]);
    
      if (isLoading) {
        return <FontAwesomeIcon icon={faSpinner} size='2xl' spin color="#fff" />;
      }

    return (
        <div className='viewContainer'>
          <div className='pdfContainer' onClick={onClick}> 
            
          </div>
        </div>
    )
}

export default VisualizarPDF