// src/components/contratos/UploadContratoOficial.jsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import useContratos from '../../hooks/useContratos';
import { styled } from '@mui/material/styles';

const UploadInput = styled('input')({
  display: 'none',
});

const UploadContratoOficial = ({ contratoId, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const { oficializarContrato } = useContratos();
  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setNotification({
        open: true,
        message: 'Por favor, selecione um arquivo PDF válido',
        severity: 'error'
      });
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      // Aqui você implementaria a lógica para fazer upload do arquivo para seu servidor/storage
      // Este é um exemplo simplificado
      const formData = new FormData();
      formData.append('file', file);
      
      // Exemplo de chamada para API de upload
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Falha ao fazer upload do arquivo');
      }
      
      const data = await response.json();
      const fileUrl = data.fileUrl;
      
      // Oficializar o contrato com a URL do documento
      await oficializarContrato(contratoId, fileUrl);
      
      setNotification({
        open: true,
        message: 'Contrato oficializado com sucesso!',
        severity: 'success'
      });
      
      if (onSuccess) {
        onSuccess(fileUrl);
      }
      
      setOpen(false);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setNotification({
        open: true,
        message: `Erro ao oficializar contrato: ${error.message || 'Erro desconhecido'}`,
        severity: 'error'
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setPreview(null);
  };
  
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<UploadIcon />}
        onClick={handleOpen}
      >
        Oficializar Contrato
      </Button>
      
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Oficializar Contrato</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Faça upload do contrato assinado em formato PDF. Uma vez oficializado, o contrato não poderá mais ser alterado diretamente.
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3 }}>
            <label htmlFor="upload-contrato">
              <UploadInput
                accept="application/pdf"
                id="upload-contrato"
                type="file"
                onChange={handleFileChange}
              />
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                sx={{ mb: 2 }}
              >
                Selecionar Arquivo PDF
              </Button>
            </label>
            
            {file && (
              <Typography variant="body2" gutterBottom>
                Arquivo selecionado: {file.name}
              </Typography>
            )}
            
            {preview && (
              <Paper
                variant="outlined"
                sx={{
                  width: '100%',
                  height: 400,
                  overflow: 'hidden',
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <iframe
                  src={preview}
                  title="Prévia do PDF"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                />
              </Paper>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={uploading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? 'Processando...' : 'Oficializar Contrato'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UploadContratoOficial;