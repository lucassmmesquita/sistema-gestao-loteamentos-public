// src/components/contratos/ContratoPreviewDialog.jsx

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography
} from '@mui/material';
import {
  Close as CloseIcon,
  Print as PrintIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const ContratoPreviewDialog = ({ open, onClose, conteudo, titulo = 'Prévia do Contrato' }) => {
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
  
  // Função para baixar o contrato como arquivo de texto
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{titulo}</Typography>
        <IconButton aria-label="close" onClick={onClose} sx={{ color: 'grey.500' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
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
        
        <Box 
          sx={{ 
            p: 3, 
            border: '1px solid', 
            borderColor: 'divider',
            borderRadius: 1,
            backgroundColor: '#f9f9f9',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            maxHeight: '60vh',
            overflow: 'auto'
          }}
        >
          {conteudo || 'Nenhum conteúdo para exibir'}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContratoPreviewDialog;