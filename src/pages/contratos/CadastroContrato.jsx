import React from 'react';
import { Typography, Container } from '@mui/material';
import ContratoForm from '../../components/contratos/ContratoForm';

const CadastroContrato = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Cadastro de Contrato
      </Typography>
      <ContratoForm />
    </Container>
  );
};

export default CadastroContrato;