import React from 'react';
import { Typography, Box } from '@mui/material';
import ClienteForm from '../../components/clientes/ClienteForm';

const CadastroCliente = () => {
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Cadastro de Cliente
      </Typography>
      <ClienteForm />
    </Box>
  );
};

export default CadastroCliente;