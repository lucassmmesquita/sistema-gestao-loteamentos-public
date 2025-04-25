import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import ImportarContratos from '../../components/contratos/ImportarContratos';

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
        Importar Contratos de Planilha
      </Typography>
      <Typography 
        variant="subtitle1" 
        color="textSecondary"
        sx={{ mb: 4 }}
      >
        Importe dados de contratos a partir de uma planilha Excel
      </Typography>
      <ImportarContratos />
    </Box>
  );
};

export default ImportarContratosPage;