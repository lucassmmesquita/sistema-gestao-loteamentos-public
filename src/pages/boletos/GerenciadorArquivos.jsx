import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import ArquivoRemessa from '../../components/boletos/ArquivoRemessa';
import ArquivoRetorno from '../../components/boletos/ArquivoRetorno';
import ImportarPagamentos from '../../components/boletos/ImportarPagamentos';

const GerenciadorArquivos = () => {
  const [tabValue, setTabValue] = useState(0);
  
  // Manipulador para mudança de tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
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
    </Container>
  );
};

export default GerenciadorArquivos;