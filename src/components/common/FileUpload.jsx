import React, { useState } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  IconButton, 
  Paper,
  Chip
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const FileUpload = ({ label, onChange, value = [], maxFiles = 5, acceptedFileTypes = '*' }) => {
  const [dragActive, setDragActive] = useState(false);
  
  // Manipulador para seleção de arquivos
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    if (value.length + newFiles.length > maxFiles) {
      alert(`Você pode enviar no máximo ${maxFiles} arquivos.`);
      return;
    }
    
    // Verifica se já existem arquivos com o mesmo nome
    const existingFileNames = value.map(file => file.name);
    const duplicates = newFiles.filter(file => existingFileNames.includes(file.name));
    
    if (duplicates.length > 0) {
      alert(`Alguns arquivos já foram enviados: ${duplicates.map(f => f.name).join(', ')}`);
      return;
    }
    
    onChange([...value, ...newFiles]);
  };
  
  // Manipulador para remover um arquivo
  const handleRemoveFile = (index) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };
  
  // Manipuladores para drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      
      if (value.length + newFiles.length > maxFiles) {
        alert(`Você pode enviar no máximo ${maxFiles} arquivos.`);
        return;
      }
      
      // Verifica se já existem arquivos com o mesmo nome
      const existingFileNames = value.map(file => file.name);
      const duplicates = newFiles.filter(file => existingFileNames.includes(file.name));
      
      if (duplicates.length > 0) {
        alert(`Alguns arquivos já foram enviados: ${duplicates.map(f => f.name).join(', ')}`);
        return;
      }
      
      onChange([...value, ...newFiles]);
    }
  };
  
  // Função auxiliar para formatar o tamanho do arquivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Função auxiliar para extrair a extensão do arquivo
  const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      
      {/* Área de upload */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.400',
          bgcolor: dragActive ? 'action.hover' : 'background.paper',
          borderRadius: 2,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          mb: 2
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload').click()}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          accept={acceptedFileTypes}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          Arraste e solte arquivos aqui
        </Typography>
        <Typography variant="body2" color="textSecondary">
          ou clique para selecionar arquivos
        </Typography>
        <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 1 }}>
          {`Máximo de ${maxFiles} arquivos`}
        </Typography>
        <Button
          variant="contained"
          component="span"
          sx={{ mt: 2 }}
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById('file-upload').click();
          }}
        >
          Selecionar Arquivos
        </Button>
      </Paper>
      
      {/* Lista de arquivos */}
      {value.length > 0 && (
        <List>
          {value.map((file, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFile(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={formatFileSize(file.size)}
              />
              <Chip 
                label={getFileExtension(file.name).toUpperCase()} 
                size="small" 
                sx={{ ml: 1 }} 
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FileUpload;