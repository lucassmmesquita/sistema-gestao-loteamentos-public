// src/pages/contratos/VincularContratosPage.jsx
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Breadcrumb from '../../components/common/Breadcrumb';
import VincularContrato from '../../components/contratos/VincularContrato';

const VincularContratosPage = () => {
  return (
    <Container maxWidth="lg">
      <Breadcrumb />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Vincular Contratos
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Associe contratos a clientes existentes no sistema
        </Typography>
      </Box>
      <VincularContrato />
    </Container>
  );
};

export default VincularContratosPage;