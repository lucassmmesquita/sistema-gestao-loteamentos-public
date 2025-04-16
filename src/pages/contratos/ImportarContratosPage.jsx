// src/pages/contratos/ImportarContratosPage.jsx
import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import ImportarContratos from '../../components/documentos/ImportarContratos';

const ImportarContratosPage = () => {
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
        Importar Contratos em PDF
      </Typography>
      <Typography 
        variant="subtitle1" 
        color="textSecondary"
        sx={{ mb: 4 }}
      >
        Extraia automaticamente dados de contratos em formato PDF
      </Typography>
      <ImportarContratos />
    </Box>
  );
};

export default ImportarContratosPage;