import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Container, Alert, Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContratoForm from '../../components/contratos/ContratoForm';
import useContratos from '../../hooks/useContratos';
import Loading from '../../components/common/Loading';

const EditarContrato = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadContrato, currentContrato, loading, error } = useContratos();
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const fetchContrato = async () => {
      if (id) {
        await loadContrato(parseInt(id));
        setLoaded(true);
      }
    };
    
    fetchContrato();
  }, [id, loadContrato]);
  
  return (
    <Container maxWidth="lg">
      <Loading open={loading && !loaded} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/contratos')}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          Editar Contrato
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loaded && !currentContrato && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Contrato não encontrado. Verifique se o ID está correto.
        </Alert>
      )}
      
      {loaded && currentContrato && (
        <ContratoForm contrato={currentContrato} />
      )}
    </Container>
  );
};

export default EditarContrato;