import React, { useState } from 'react';
import { Typography, Box, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import ArquivoRemessa from '../../components/boletos/ArquivoRemessa';
import ArquivoRetorno from '../../components/boletos/ArquivoRetorno';
import ImportarPagamentos from '../../components/boletos/ImportarPagamentos';

const GerenciadorArquivos = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Manipulador para mudança de tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
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
        Gerenciador de Arquivos
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Gerar Arquivo de Remessa" />
          <Tab label="Processar Arquivo de Retorno" />
          <Tab label="Importar Pagamentos" />
        </Tabs>
      </Box>
      
      {tabValue === 0 && (
        <ArquivoRemessa />
      )}
      
      {tabValue === 1 && (
        <ArquivoRetorno />
      )}
      
      {tabValue === 2 && (
        <ImportarPagamentos />
      )}
    </Box>
  );
};

export default GerenciadorArquivos;