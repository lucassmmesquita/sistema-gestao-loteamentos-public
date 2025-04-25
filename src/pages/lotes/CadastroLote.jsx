// src/pages/lotes/CadastroLote.jsx

import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import LoteForm from '../../components/lotes/LoteForm';

const CadastroLote = () => {
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
        Cadastro de Lote
      </Typography>
      <LoteForm />
    </Box>
  );
};

export default CadastroLote;