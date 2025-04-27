// src/components/documentos/DocumentosContrato.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Description as DescriptionIcon,
  FileCopy as FileCopyIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  AttachFile as AttachFileIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/formatters';

const DocumentosContrato = ({ contratoId }) => {
  // Estado para armazenar os documentos
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [documentoData, setDocumentoData] = useState({
    tipo: 'contrato',
    descricao: ''
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Carregar documentos do contrato
  useEffect(() => {
    const fetchDocumentos = async () => {
      // Simulação - em um ambiente real, isso viria da API
      setLoading(true);
      
      try {
        // Simulação de chamada à API
        // const response = await api.get(`/contratos/${contratoId}/documentos`);
        // setDocumentos(response.data);
        
        // Dados simulados para visualização
        setTimeout(() => {
          setDocumentos([
            {
              id: 1,
              tipo: 'contrato',
              nome: 'Contrato Original.pdf',
              descricao: 'Contrato original assinado',
              dataUpload: '2023-10-15T10:30:00',
              url: '#'
            },
            {
              id: 2,
              tipo: 'aditivo',
              nome: 'Aditivo 001-2023.pdf',
              descricao: 'Aditivo de prazo',
              dataUpload: '2023-11-20T14:45:00',
              url: '#'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
        setLoading(false);
      }
    };
    
    fetchDocumentos();
  }, [contratoId]);
  
  // Manipuladores de eventos
  const handleOpenUploadDialog = () => {
    setUploadDialogOpen(true);
  };
  
  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
    setUploadFile(null);
    setDocumentoData({
      tipo: 'contrato',
      descricao: ''
    });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDocumentoData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleUpload = async () => {
    if (!uploadFile) {
      setNotification({
        open: true,
        message: 'Por favor, selecione um arquivo para upload.',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulação de upload - em um ambiente real, usaria FormData para enviar o arquivo
      // const formData = new FormData();
      // formData.append('file', uploadFile);
      // formData.append('tipo', documentoData.tipo);
      // formData.append('descricao', documentoData.descricao);
      
      // const response = await api.post(`/contratos/${contratoId}/documentos`, formData);
      
      // Simulação de resposta
      setTimeout(() => {
        const novoDocumento = {
          id: documentos.length + 1,
          tipo: documentoData.tipo,
          nome: uploadFile.name,
          descricao: documentoData.descricao,
          dataUpload: new Date().toISOString(),
          url: '#'
        };
        
        setDocumentos(prev => [...prev, novoDocumento]);
        
        setNotification({
          open: true,
          message: 'Documento enviado com sucesso!',
          severity: 'success'
        });
        
        handleCloseUploadDialog();
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Erro ao fazer upload do documento:', error);
      
      setNotification({
        open: true,
        message: 'Erro ao enviar documento. Tente novamente.',
        severity: 'error'
      });
      
      setLoading(false);
    }
  };
  
  const handleDeleteDocumento = (id) => {
    // Em um ambiente real, faria uma chamada à API para deletar
    // await api.delete(`/contratos/documentos/${id}`);
    
    // Simulação
    setDocumentos(prev => prev.filter(doc => doc.id !== id));
    
    setNotification({
      open: true,
      message: 'Documento excluído com sucesso!',
      severity: 'success'
    });
  };
  
  // Mapeia o tipo para uma descrição mais amigável
  const getTipoDocumento = (tipo) => {
    const tipos = {
      'contrato': 'Contrato',
      'aditivo': 'Aditivo',
      'distrato': 'Distrato',
      'quitacao': 'Quitação',
      'outros': 'Outros'
    };
    
    return tipos[tipo] || 'Documento';
  };
  
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Documentos do Contrato
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={handleOpenUploadDialog}
          >
            Enviar Documento
          </Button>
        </Box>
        
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          {documentos.length > 0 ? (
            <List>
              {documentos.map((documento, index) => (
                <React.Fragment key={documento.id}>
                  {index > 0 && <Divider variant="inset" component="li" />}
                  <ListItem>
                    <ListItemIcon>
                      <FileCopyIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={documento.nome}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.secondary">
                            {documento.descricao}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="text.secondary">
                            Tipo: {getTipoDocumento(documento.tipo)} | Enviado em: {formatDate(documento.dataUpload)}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Visualizar">
                        <IconButton edge="end" aria-label="visualizar" href={documento.url} target="_blank" rel="noopener noreferrer">
                          <AttachFileIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Copiar Link">
                        <IconButton edge="end" aria-label="copiar link">
                          <LinkIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton edge="end" aria-label="excluir" color="error" onClick={() => handleDeleteDocumento(documento.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="body1" color="text.secondary">
                Nenhum documento anexado a este contrato.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
      
      {/* Diálogo de Upload */}
      <Dialog open={uploadDialogOpen} onClose={handleCloseUploadDialog}>
        <DialogTitle>Enviar Documento</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              id="upload-file-button"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="upload-file-button">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Selecionar Arquivo
              </Button>
            </label>
            
            {uploadFile && (
              <Typography variant="body2" gutterBottom>
                Arquivo selecionado: {uploadFile.name}
              </Typography>
            )}
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo de Documento</InputLabel>
              <Select
                name="tipo"
                value={documentoData.tipo}
                label="Tipo de Documento"
                onChange={handleInputChange}
              >
                <MenuItem value="contrato">Contrato</MenuItem>
                <MenuItem value="aditivo">Aditivo</MenuItem>
                <MenuItem value="distrato">Distrato</MenuItem>
                <MenuItem value="quitacao">Quitação</MenuItem>
                <MenuItem value="outros">Outros</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Descrição"
              name="descricao"
              value={documentoData.descricao}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Cancelar</Button>
          <Button
            onClick={handleUpload}
            color="primary"
            variant="contained"
            disabled={loading || !uploadFile}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notificação */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DocumentosContrato;