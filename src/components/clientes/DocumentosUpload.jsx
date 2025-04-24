// src/components/clientes/DocumentosUpload.jsx

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import {
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Visibility as VisibilityIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as TextIcon
} from '@mui/icons-material';
import api from '../../services/api';

// Tipos de documentos aceitos
const tiposDocumentos = [
  { value: 'RG', label: 'RG' },
  { value: 'CPF', label: 'CPF' },
  { value: 'CNH', label: 'CNH' },
  { value: 'COMPROVANTE_RESIDENCIA', label: 'Comprovante de Residência' },
  { value: 'CERTIDAO_CASAMENTO', label: 'Certidão de Casamento' },
  { value: 'CONTRATO_SOCIAL', label: 'Contrato Social' },
  { value: 'OUTRO', label: 'Outro' }
];

const DocumentosUpload = ({ documentos = [], onChange, clienteId }) => {
  const [tipo, setTipo] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, documento: null });
  const [loadedDocumentos, setLoadedDocumentos] = useState([]);
  
  // Carregar documentos do cliente do backend quando clienteId mudar
  useEffect(() => {
    const carregarDocumentos = async () => {
      if (clienteId) {
        try {
          const response = await api.get(`/documentos?clienteId=${clienteId}`);
          setLoadedDocumentos(response.data);
          onChange(response.data);
          console.log('Documentos carregados:', response.data);
        } catch (err) {
          console.error('Erro ao carregar documentos:', err);
          setError('Erro ao carregar documentos do cliente.');
        }
      }
    };
    
    carregarDocumentos();
  }, [clienteId]);
  
  // Manipulador para seleção de tipo de documento
  const handleTipoChange = (event) => {
    setTipo(event.target.value);
  };
  
  // Manipulador para seleção de arquivo
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setArquivo(event.target.files[0]);
    }
  };
  
  // Manipulador para upload de arquivo
  const handleUpload = async () => {
    if (!tipo) {
      setError('Selecione o tipo de documento');
      return;
    }
    
    if (!arquivo) {
      setError('Selecione um arquivo');
      return;
    }
    
    if (!clienteId) {
      setError('Cliente não identificado. Salve o cadastro primeiro.');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      // Criar FormData para envio do arquivo
      const formData = new FormData();
      formData.append('file', arquivo);
      formData.append('tipoDocumento', tipo);
      
      console.log('Enviando arquivo:', {
        clienteId,
        tipoDocumento: tipo,
        arquivo: {
          name: arquivo.name,
          type: arquivo.type,
          size: arquivo.size
        }
      });
      
      // Enviar para o backend
      const response = await api.post(`/documentos/upload/${clienteId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Resposta do upload:', response.data);
      
      // Adiciona o documento à lista
      const novoDocumento = response.data;
      const listaAtualizada = [...documentos, novoDocumento];
      
      onChange(listaAtualizada);
      setLoadedDocumentos(listaAtualizada);
      
      // Limpa o formulário
      setTipo('');
      setArquivo(null);
      
      // Reset o input de arquivo
      const fileInput = document.getElementById('documento-upload');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err) {
      console.error('Erro ao fazer upload do documento:', err);
      setError(`Erro ao fazer upload: ${err.response?.data?.message || err.message || 'Erro desconhecido'}`);
    } finally {
      setUploading(false);
    }
  };
  
  // Manipulador para remover documento
  const confirmDelete = (documento) => {
    setDeleteDialog({ open: true, documento });
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, documento: null });
  };
  
  const handleDeleteConfirm = async () => {
    const documento = deleteDialog.documento;
    
    if (!documento) return;
    
    try {
      // Remover do backend
      await api.delete(`/documentos/${documento.id}`);
      
      // Remove da lista local
      const novosDocumentos = documentos.filter(doc => 
        doc.id !== documento.id
      );
      
      onChange(novosDocumentos);
      setLoadedDocumentos(novosDocumentos);
    } catch (err) {
      console.error('Erro ao remover documento:', err);
      setError(`Erro ao remover documento: ${err.response?.data?.message || err.message || 'Erro desconhecido'}`);
    } finally {
      setDeleteDialog({ open: false, documento: null });
    }
  };
  
  // Manipulador para visualizar documento
  const handlePreview = (url) => {
    // Para URLs locais, adicionar a base URL da API
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    let previewUrl = url;
    
    if (url && url.startsWith('/uploads')) {
      previewUrl = `${apiUrl}${url}`;
    }
    
    setPreviewUrl(previewUrl);
    setPreviewOpen(true);
  };
  
  // Determina o ícone do arquivo com base no tipo
  const getFileIcon = (tipoArquivo) => {
    if (tipoArquivo && tipoArquivo.includes('pdf')) {
      return <PdfIcon />;
    } else if (tipoArquivo && tipoArquivo.includes('image')) {
      return <ImageIcon />;
    } else {
      return <TextIcon />;
    }
  };
  
  // Função auxiliar para formatar o tamanho do arquivo
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Função auxiliar para formatar a data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Documentos
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {/* Card para upload de novo documento */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Adicionar Novo Documento
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="tipo-documento-label">Tipo de Documento</InputLabel>
                <Select
                  labelId="tipo-documento-label"
                  id="tipo-documento"
                  value={tipo}
                  label="Tipo de Documento"
                  onChange={handleTipoChange}
                  disabled={uploading || !clienteId}
                >
                  {tiposDocumentos.map((tipoItem) => (
                    <MenuItem key={tipoItem.value} value={tipoItem.value}>
                      {tipoItem.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box 
                sx={{
                  border: '2px dashed',
                  borderColor: 'grey.400',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: !uploading && clienteId ? 'primary.main' : 'grey.400',
                    backgroundColor: !uploading && clienteId ? 'rgba(0, 114, 229, 0.05)' : 'transparent'
                  }
                }}
              >
                {uploading ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress size={40} sx={{ mb: 2 }} />
                    <Typography>Enviando documento...</Typography>
                  </Box>
                ) : !clienteId ? (
                  <Box>
                    <UploadIcon sx={{ fontSize: 40, mb: 1, color: 'text.disabled' }} />
                    <Typography variant="body1" gutterBottom color="text.disabled">
                      Salve o cadastro do cliente antes de adicionar documentos
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <UploadIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
                    <Typography variant="body1" gutterBottom>
                      Selecione um arquivo para upload
                    </Typography>
                    <input
                      id="documento-upload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="documento-upload">
                      <Button
                        variant="contained"
                        component="span"
                        disabled={uploading}
                        sx={{ mt: 2 }}
                      >
                        Selecionar Arquivo
                      </Button>
                    </label>
                    {arquivo && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                        Arquivo selecionado: {arquivo.name} ({formatFileSize(arquivo.size)})
                      </Typography>
                    )}
                    {tipo && arquivo && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={uploading}
                        sx={{ mt: 2, ml: 2 }}
                      >
                        Enviar
                      </Button>
                    )}
                    {!tipo && (
                      <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        Selecione o tipo de documento antes de fazer upload
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Lista de documentos */}
      {documentos.length > 0 ? (
        <List>
          {documentos.map((doc, index) => {
            // Encontra o label correspondente ao tipo de documento
            const tipoLabel = tiposDocumentos.find(t => t.value === doc.tipo)?.label || doc.tipo;
            
            return (
              <ListItem
                key={doc.id || index}
                sx={{ 
                  bgcolor: 'background.paper', 
                  mb: 1, 
                  borderRadius: 1,
                  boxShadow: 1
                }}
              >
                <ListItemIcon>
                  {getFileIcon(doc.tipoArquivo || doc.nome.split('.').pop())}
                </ListItemIcon>
                <ListItemText
                  primary={doc.nomeArquivo || doc.nome}
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        {formatFileSize(doc.tamanho) || ''}
                      </Typography>
                      {doc.dataUpload && (
                        <Typography variant="body2" component="span" sx={{ ml: 2 }}>
                          Enviado em: {formatDate(doc.dataUpload)}
                        </Typography>
                      )}
                    </>
                  }
                />
                <Chip 
                  label={tipoLabel} 
                  color="primary" 
                  size="small" 
                  sx={{ mr: 2 }} 
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="preview" onClick={() => handlePreview(doc.url || doc.arquivo)} sx={{ mr: 1 }}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => confirmDelete(doc)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="body1" color="textSecondary">
            Nenhum documento adicionado
          </Typography>
        </Box>
      )}
      
      {/* Diálogo de visualização */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Visualização do Documento</DialogTitle>
        <DialogContent>
          {previewUrl && (
            previewUrl.toLowerCase().endsWith('.pdf') ? (
              <object
                data={previewUrl}
                type="application/pdf"
                width="100%"
                height="500px"
              >
                <Typography>
                  Não foi possível exibir o PDF. <a href={previewUrl} target="_blank" rel="noopener noreferrer">Clique aqui para baixar</a>
                </Typography>
              </object>
            ) : previewUrl.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src={previewUrl}
                  alt="Documento"
                  style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                />
              </Box>
            ) : (
              <Typography>
                Este tipo de documento não pode ser visualizado no navegador. <a href={previewUrl} target="_blank" rel="noopener noreferrer">Clique aqui para baixar</a>
              </Typography>
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Fechar</Button>
          <Button 
            href={previewUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            color="primary"
          >
            Abrir em Nova Aba
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentosUpload;