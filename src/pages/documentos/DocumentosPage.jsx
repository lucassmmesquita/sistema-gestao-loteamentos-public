// src/pages/documentos/DocumentosPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import Breadcrumb from '../../components/common/Breadcrumb';
import ContratoTreeView from '../../components/documentos/ContratoTreeView';

const DocumentosPage = () => {
  const { clienteId, contratoId } = useParams();
  
  return (
    <Container maxWidth="lg">
      <Breadcrumb />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Documentos Contratuais
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Visualize todos os documentos associados ao contrato
        </Typography>
      </Box>
      <ContratoTreeView clienteId={clienteId} contratoId={contratoId} />
    </Container>
  );
};

export default DocumentosPage;