import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
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
  Image as ImageIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/formatters';

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

const ContratoTreeView = ({ documentos = [], onViewDocument }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState({});
  
  // Toggle folder expansion
  const handleToggle = (nodeId) => {
    setExpanded({
      ...expanded,
      [nodeId]: !expanded[nodeId]
    });
  };
  
  // Handle document click
  const handleDocumentClick = (documento) => {
    if (onViewDocument) {
      onViewDocument(documento);
    }
  };
  
  // Organize documents by type/category
  const organizeDocumentos = () => {
    const categories = {};
    
    documentos.forEach(doc => {
      const category = doc.categoria || 'Outros';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(doc);
    });
    
    return categories;
  };
  
  const documentosByCategory = organizeDocumentos();
  const categoryIds = Object.keys(documentosByCategory);
  
  return (
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
                          onClick={() => handleDocumentClick(doc)}
                        >
                          <ListItemIcon>
                            <FileTypeIcon type={fileType} />
                          </ListItemIcon>
                          <ListItemText
                            primary={doc.nome || doc.nomeArquivo || `Documento ${index+1}`}
                            secondary={doc.dataUpload ? formatDate(doc.dataUpload) : undefined}
                          />
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
  );
};

export default ContratoTreeView;