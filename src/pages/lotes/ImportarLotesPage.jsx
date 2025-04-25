import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import ImportarLotes from '../../components/lotes/ImportarLotes';

const ImportarLotesPage = () => {
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
        Importar Lotes de Planilha
      </Typography>
      <Typography 
        variant="subtitle1" 
        color="textSecondary"
        sx={{ mb: 4 }}
      >
        Importe dados de lotes a partir de uma planilha Excel
      </Typography>
      <ImportarLotes />
    </Box>
  );
};

export default ImportarLotesPage;