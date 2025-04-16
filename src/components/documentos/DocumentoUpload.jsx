// src/components/documentos/DocumentoUpload.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Divider,
  Alert
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import FileUpload from '../common/FileUpload';

const DocumentoUpload = ({ onUpload, contratoId }) => {
  const [documentos, setDocumentos] = useState([]);
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tipos de documentos associados ao contrato
  const tiposDocumentos = [
    { value: 'CONTRATO', label: 'Contrato de Aquisição' },
    { value: 'REAJUSTE', label: 'Reajuste Anual' },
    { value: 'ADITIVO_RENEGOCIACAO', label: 'Aditivo - Renegociação de parcelas' },
    { value: 'ADITIVO_ANTECIPACAO', label: 'Aditivo - Antecipação de pagamentos' },
    { value: 'DISTRATO', label: 'Distrato' },
    { value: 'QUITACAO', label: 'Minuta de Quitação' }
  ];

  const handleTipoChange = (event) => {
    setTipoDocumento(event.target.value);
    setError('');
  };

  const handleUpload = () => {
    if (!tipoDocumento) {
      setError('Selecione o tipo de documento');
      return;
    }

    if (documentos.length === 0) {
      setError('Selecione pelo menos um arquivo para upload');
      return;
    }

    // Em um sistema real, aqui faria o upload para o servidor
    // Para simulação, vamos apenas chamar o callback com os dados
    const tipoLabel = tiposDocumentos.find(t => t.value === tipoDocumento)?.label || tipoDocumento;
    
    const uploadData = documentos.map(doc => ({
      id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      nome: doc.name,
      tamanho: doc.size,
      tipo: doc.type,
      categoria: tipoDocumento,
      categoriaLabel: tipoLabel,
      dataUpload: new Date().toISOString(),
      contratoId: contratoId,
      arquivo: doc.name,
      // Em um sistema real, teríamos a URL do arquivo após upload
      url: URL.createObjectURL(doc)
    }));

    if (onUpload) {
      onUpload(uploadData);
      setSuccess('Documento(s) enviado(s) com sucesso!');
      setDocumentos([]);
      setTipoDocumento('');
      
      // Limpar mensagem de sucesso após alguns segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Adicionar Novo Documento
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!error && !tipoDocumento}>
            <InputLabel id="tipo-documento-label">Tipo de Documento</InputLabel>
            <Select
              labelId="tipo-documento-label"
              value={tipoDocumento}
              onChange={handleTipoChange}
              label="Tipo de Documento"
            >
              {tiposDocumentos.map(tipo => (
                <MenuItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FileUpload
            label="Selecione o documento para upload"
            value={documentos}
            onChange={setDocumentos}
            maxFiles={5}
            acceptedFileTypes=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
        </Grid>
      </Grid>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadIcon />}
          onClick={handleUpload}
          disabled={!tipoDocumento || documentos.length === 0}
        >
          Enviar Documento
        </Button>
      </Box>
    </Paper>
  );
};

export default DocumentoUpload;