import React from 'react';
import { Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import ClienteList from '../../components/clientes/ClienteList';

const ListaClientes = () => {
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
        Gerenciamento de Clientes
      </Typography>
      <ClienteList />
    </Box>
  );
};

export default ListaClientes;