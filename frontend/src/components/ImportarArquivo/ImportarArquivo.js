import React from 'react'
import * as XLSX from 'xlsx';

function ImportarArquivo() {

    const [data, setData] = React.useState(null);

    const handleArquivoUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(sheet);

            setData(jsonData);
        };

        reader.readAsBinaryString(file);
    }

    return (
        <div>
            <input type="file" onChange={handleArquivoUpload} />
            {data && (
                <div>
                    <p>Arquivo carregado:</p>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );

}

export default ImportarArquivo;