import React from 'react';
import { Typography, Container } from '@mui/material';
import ContratoList from '../../components/contratos/ContratoList';

const ListaContratos = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Gerenciamento de Contratos
      </Typography>
      <ContratoList />
    </Container>
  );
};

export default ListaContratos;