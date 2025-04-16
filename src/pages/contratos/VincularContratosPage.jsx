// src/pages/contratos/VincularContratosPage.jsx
import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import VincularContrato from '../../components/contratos/VincularContrato';

const VincularContratosPage = () => {
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
        Vincular Contratos
      </Typography>
      <Typography 
        variant="subtitle1" 
        color="textSecondary"
        sx={{ mb: 4 }}
      >
        Associe contratos a clientes existentes no sistema
      </Typography>
      <VincularContrato />
    </Box>
  );
};

export default VincularContratosPage;