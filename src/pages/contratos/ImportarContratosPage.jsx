// src/pages/contratos/ImportarContratosPage.jsx
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
// Removendo a importação do Breadcrumb
// import Breadcrumb from '../../components/common/Breadcrumb';
import ImportarContratos from '../../components/documentos/ImportarContratos';

const ImportarContratosPage = () => {
  return (
    <Container maxWidth="lg">
      {/* Removendo a linha do Breadcrumb abaixo */}
      {/* <Breadcrumb /> */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Importar Contratos em PDF
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Extraia automaticamente dados de contratos em formato PDF
        </Typography>
      </Box>
      <ImportarContratos />
    </Container>
  );
};

export default ImportarContratosPage;