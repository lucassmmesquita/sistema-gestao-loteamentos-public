import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material';

const ContratoPreview = ({ conteudo }) => {
  // Função para imprimir o contrato
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Contrato</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 2cm;
            }
            pre {
              font-family: Arial, sans-serif;
              white-space: pre-wrap;
              font-size: 12pt;
            }
            h1 {
              text-align: center;
              margin-bottom: 30px;
            }
          </style>
        </head>
        <body>
          <pre>${conteudo}</pre>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Dá tempo para o navegador renderizar o conteúdo
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
  
  // Função para baixar o contrato como PDF
  // Na implementação real, seria feito um pedido para o backend para gerar o PDF
  // Neste exemplo, simularemos um download como arquivo de texto
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([conteudo], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `contrato_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ mr: 1 }}
        >
          Imprimir
        </Button>
        <Button
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
        >
          Baixar
        </Button>
      </Box>
      
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          maxHeight: '70vh',
          overflow: 'auto',
          backgroundColor: '#f9f9f9',
          fontFamily: 'monospace'
        }}
      >
        <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
          {conteudo || 'Nenhum conteúdo para exibir'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ContratoPreview;