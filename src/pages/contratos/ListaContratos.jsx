import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import ContratoList from '../../components/contratos/ContratoList';

const ListaContratos = () => {
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
        Gerenciamento de Contratos
      </Typography>
      <ContratoList />
    </Box>
  );
};

export default ListaContratos;