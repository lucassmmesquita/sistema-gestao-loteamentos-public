import React from 'react';
import { Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import BoletoList from '../../components/boletos/BoletoList';

const GerenciarBoletos = () => {
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
        Gerenciamento de Boletos
      </Typography>
      <BoletoList />
    </Box>
  );
};

export default GerenciarBoletos;