import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Container, Box, Button, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisualizarBoleto from '../../components/boletos/VisualizarBoleto';
import useBoletos from '../../hooks/useBoletos';
import Loading from '../../components/common/Loading';

const BoletosDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadBoleto, currentBoleto, loading, error } = useBoletos();
  
  useEffect(() => {
    if (id) {
      loadBoleto(parseInt(id));
    }
  }, [id, loadBoleto]);
  
  return (
    <Container maxWidth="lg">
      <Loading open={loading} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/boletos')}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          Detalhes do Boleto
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {!loading && !currentBoleto && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Boleto não encontrado. Verifique se o ID está correto.
        </Alert>
      )}
      
      {currentBoleto && (
        <VisualizarBoleto boleto={currentBoleto} />
      )}
    </Container>
  );
};

export default BoletosDetails;