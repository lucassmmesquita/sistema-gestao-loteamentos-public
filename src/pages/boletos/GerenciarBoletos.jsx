import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon } from '@mui/icons-material';
import BoletoList from '../../components/boletos/BoletoList';

const GerenciarBoletos = () => {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gerenciar Boletos
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/boletos/emitir')}
        >
          Emitir Boleto
        </Button>
      </Box>
      
      <BoletoList />
    </Container>
  );
};

export default GerenciarBoletos;