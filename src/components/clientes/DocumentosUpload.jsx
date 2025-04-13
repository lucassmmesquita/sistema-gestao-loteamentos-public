import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
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
  Chip
} from '@mui/material';
import {
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import FileUpload from '../common/FileUpload';

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

const DocumentosUpload = ({ documentos = [], onChange }) => {
  const [novoDocumento, setNovoDocumento] = useState({
    tipo: '',
    arquivo: null
  });
  const [arquivosSelecionados, setArquivosSelecionados] = useState([]);
  
  // Manipulador para seleção de tipo de documento
  const handleTipoChange = (event) => {
    setNovoDocumento({ ...novoDocumento, tipo: event.target.value });
  };
  
  // Manipulador para seleção de arquivo
  const handleArquivoChange = (files) => {
    setArquivosSelecionados(files);
  };
  
  // Manipulador para adicionar documento
  const handleAdicionarDocumento = () => {
    if (!novoDocumento.tipo || arquivosSelecionados.length === 0) {
      alert('Selecione o tipo e o arquivo do documento');
      return;
    }
    
    // Em um cenário real, aqui faríamos o upload do arquivo para o servidor
    // e receberíamos o URL ou ID do arquivo. Para este exemplo, simularemos isso.
    
    // Para cada arquivo selecionado, cria um documento
    const novosDocumentos = arquivosSelecionados.map(arquivo => ({
      tipo: novoDocumento.tipo,
      nomeArquivo: arquivo.name,
      tamanho: arquivo.size,
      tipoArquivo: arquivo.type,
      dataUpload: new Date().toISOString(),
      // Em um cenário real, aqui teríamos o URL ou ID do arquivo após o upload
      url: URL.createObjectURL(arquivo), // Cria uma URL temporária para simulação
      // Para o exemplo, guardaremos o próprio arquivo, mas em produção não faríamos isso
      arquivoOriginal: arquivo
    }));
    
    // Adiciona os novos documentos à lista
    onChange([...documentos, ...novosDocumentos]);
    
    // Limpa o formulário
    setNovoDocumento({ tipo: '', arquivo: null });
    setArquivosSelecionados([]);
  };
  
  // Manipulador para remover documento
  const handleRemoverDocumento = (index) => {
    const novosDocumentos = [...documentos];
    novosDocumentos.splice(index, 1);
    onChange(novosDocumentos);
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
      
      {/* Card para upload de novo documento */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Adicionar Novo Documento
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="tipo-documento-label">Tipo de Documento</InputLabel>
                <Select
                  labelId="tipo-documento-label"
                  id="tipo-documento"
                  value={novoDocumento.tipo}
                  label="Tipo de Documento"
                  onChange={handleTipoChange}
                >
                  {tiposDocumentos.map((tipo) => (
                    <MenuItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FileUpload
                label="Selecione o arquivo"
                onChange={handleArquivoChange}
                value={arquivosSelecionados}
                maxFiles={1}
                acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<UploadIcon />}
            onClick={handleAdicionarDocumento}
            disabled={!novoDocumento.tipo || arquivosSelecionados.length === 0}
          >
            Adicionar Documento
          </Button>
        </CardActions>
      </Card>
      
      {/* Lista de documentos */}
      {documentos.length > 0 ? (
        <List>
          {documentos.map((doc, index) => {
            // Encontra o label correspondente ao tipo de documento
            const tipoLabel = tiposDocumentos.find(t => t.value === doc.tipo)?.label || doc.tipo;
            
            return (
              <ListItem
                key={index}
                sx={{ 
                  bgcolor: 'background.paper', 
                  mb: 1, 
                  borderRadius: 1,
                  boxShadow: 1
                }}
              >
                <ListItemIcon>
                  <FileIcon />
                </ListItemIcon>
                <ListItemText
                  primary={doc.nomeArquivo}
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        {formatFileSize(doc.tamanho)}
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
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoverDocumento(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" color="textSecondary">
            Nenhum documento adicionado
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DocumentosUpload;