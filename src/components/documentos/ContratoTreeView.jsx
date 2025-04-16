// src/components/documentos/ContratoTreeView.jsx - Atualizado
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Description as DescriptionIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/formatters';
import useDocumentosContratuais from '../../hooks/useDocumentosContratuais';
import DocumentoUpload from './DocumentoUpload';

// Styled components
const TreeItem = styled(ListItem)(({ theme, depth = 0, isFolder, isExpanded }) => ({
  padding: theme.spacing(0.5, 1),
  paddingLeft: theme.spacing(2 + (depth * 2)),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: isExpanded 
    ? alpha(theme.palette.primary.main, 0.08)
    : 'transparent',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

const TreeViewContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  maxHeight: 400,
  overflow: 'auto',
}));

const FileTypeIcon = ({ type }) => {
  // Determine icon based on file extension
  switch(type?.toLowerCase()) {
    case 'pdf':
      return <PdfIcon color="error" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <ImageIcon color="primary" />;
    default:
      return <FileIcon color="action" />;
  }
};

const ContratoTreeView = ({ contratoId }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState({});
  const [documentos, setDocumentos] = useState([]);
  const [viewDialog, setViewDialog] = useState({
    open: false,
    documento: null
  });
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    open: false,
    documento: null
  });
  
  const { loadDocumentosByContrato, deleteDocumento } = useDocumentosContratuais();
  
  // Carregar documentos do contrato
  useEffect(() => {
    const carregarDocumentos = async () => {
      if (contratoId) {
        try {
          const docs = await loadDocumentosByContrato(parseInt(contratoId));
          setDocumentos(docs || []);
        } catch (error) {
          console.error('Erro ao carregar documentos:', error);
        }
      }
    };
    
    carregarDocumentos();
  }, [contratoId, loadDocumentosByContrato]);
  
  // Toggle folder expansion
  const handleToggle = (nodeId) => {
    setExpanded({
      ...expanded,
      [nodeId]: !expanded[nodeId]
    });
  };
  
  // Handle document view
  const handleViewDocument = (documento) => {
    setViewDialog({
      open: true,
      documento
    });
  };
  
  // Handle document download
  const handleDownloadDocument = (documento) => {
    // Em um sistema real, aqui faria o download do arquivo do servidor
    // Para simulação, apenas abrimos o URL em nova aba
    if (documento.url) {
      window.open(documento.url, '_blank');
    }
  };
  
  // Handle document delete confirmation
  const handleDeleteClick = (documento, event) => {
    event.stopPropagation();
    setConfirmDeleteDialog({
      open: true,
      documento
    });
  };
  
  // Handle document delete
  const handleDeleteDocument = async () => {
    if (confirmDeleteDialog.documento) {
      try {
        await deleteDocumento(confirmDeleteDialog.documento.id);
        
        // Remover o documento da lista local
        setDocumentos(prev => 
          prev.filter(doc => doc.id !== confirmDeleteDialog.documento.id)
        );
        
        // Fechar o diálogo
        setConfirmDeleteDialog({
          open: false,
          documento: null
        });
      } catch (error) {
        console.error('Erro ao excluir documento:', error);
      }
    }
  };
  
  // Organizar documentos por tipo/categoria
  const organizeDocumentos = () => {
    const categories = {};
    
    documentos.forEach(doc => {
      const category = doc.categoriaLabel || doc.categoria || 'Outros';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(doc);
    });
    
    return categories;
  };

  // Handle upload new document
  const handleUploadDocumento = (uploadedDocs) => {
    // Em um sistema real, aqui integraria com o backend
    // Para simulação, apenas adicionamos à lista local
    setDocumentos(prev => [...prev, ...uploadedDocs]);
  };
  
  const documentosByCategory = organizeDocumentos();
  const categoryIds = Object.keys(documentosByCategory);
  
  return (
    <Box>
      {/* Upload Document Section */}
      <DocumentoUpload 
        onUpload={handleUploadDocumento} 
        contratoId={contratoId} 
      />
    
      {/* Document Tree Section */}
      <TreeViewContainer>
        <Typography variant="h6" gutterBottom>
          Documentos do Contrato
        </Typography>
        
        {categoryIds.length > 0 ? (
          <List component="nav" aria-label="documentos do contrato">
            {categoryIds.map((categoryId) => {
              const isExpanded = expanded[categoryId] || false;
              const docs = documentosByCategory[categoryId];
              
              return (
                <React.Fragment key={categoryId}>
                  <TreeItem
                    isFolder
                    isExpanded={isExpanded}
                    onClick={() => handleToggle(categoryId)}
                  >
                    <ListItemIcon>
                      {isExpanded ? <FolderOpenIcon color="primary" /> : <FolderIcon color="primary" />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="subtitle1" fontWeight={500}>
                          {categoryId} ({docs.length})
                        </Typography>
                      } 
                    />
                    {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                  </TreeItem>
                  
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {docs.map((doc, index) => {
                        const fileType = doc.arquivo?.split('.').pop() || 'unknown';
                        
                        return (
                          <TreeItem
                            key={doc.id || index}
                            depth={1}
                            onClick={() => handleViewDocument(doc)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                              <ListItemIcon>
                                <FileTypeIcon type={fileType} />
                              </ListItemIcon>
                              <ListItemText
                                primary={doc.nome || doc.nomeArquivo || `Documento ${index+1}`}
                                secondary={doc.dataUpload ? formatDate(doc.dataUpload) : undefined}
                              />
                            </Box>
                            <Box>
                              <Tooltip title="Visualizar">
                                <IconButton size="small" onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDocument(doc);
                                }}>
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download">
                                <IconButton size="small" onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadDocument(doc);
                                }}>
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={(e) => handleDeleteClick(doc, e)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TreeItem>
                        );
                      })}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            })}
          </List>
        ) : (
          <Typography variant="body2" color="textSecondary" align="center">
            Nenhum documento disponível para este contrato.
          </Typography>
        )}
      </TreeViewContainer>
      
      {/* Document View Dialog */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, documento: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {viewDialog.documento?.nome || 'Visualizar Documento'}
        </DialogTitle>
        <DialogContent>
          {viewDialog.documento?.url ? (
            viewDialog.documento.tipo?.includes('image') ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={viewDialog.documento.url} 
                  alt={viewDialog.documento.nome}
                  style={{ maxWidth: '100%', maxHeight: '70vh' }} 
                />
              </Box>
            ) : viewDialog.documento.tipo?.includes('pdf') ? (
              <iframe
                src={viewDialog.documento.url}
                title={viewDialog.documento.nome}
                width="100%"
                height="500px"
                style={{ border: 'none' }}
              />
            ) : (
              <Typography align="center">
                Não é possível visualizar este tipo de documento diretamente.
                Faça o download para visualizá-lo.
              </Typography>
            )
          ) : (
            <Typography align="center">
              Documento não disponível para visualização.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, documento: null })}>
            Fechar
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => handleDownloadDocument(viewDialog.documento)}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDeleteDialog.open}
        onClose={() => setConfirmDeleteDialog({ open: false, documento: null })}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o documento "{confirmDeleteDialog.documento?.nome}"?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDeleteDialog({ open: false, documento: null })}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteDocument}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContratoTreeView;