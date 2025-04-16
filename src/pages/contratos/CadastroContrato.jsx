// src/pages/contratos/CadastroContrato.jsx
import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import ContratoForm from '../../components/contratos/ContratoForm';

const CadastroContrato = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          fontSize: { xs: '1.75rem', md: '2.125rem' },
          mb: 3
        }}
      >
        Cadastro de Contrato
      </Typography>
      <ContratoForm />
    </Box>
  );
};

export default CadastroContrato;