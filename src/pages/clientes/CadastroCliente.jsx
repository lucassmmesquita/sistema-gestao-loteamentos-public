import React from 'react';
import { Typography, Container } from '@mui/material';
import ClienteForm from '../../components/clientes/ClienteForm';

const CadastroCliente = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Cadastro de Cliente
      </Typography>
      <ClienteForm />
    </Container>
  );
};

export default CadastroCliente;