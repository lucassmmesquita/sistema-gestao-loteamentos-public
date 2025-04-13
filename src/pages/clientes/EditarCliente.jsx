import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Container, Alert, Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClienteForm from '../../components/clientes/ClienteForm';
import useClientes from '../../hooks/useClientes';
import Loading from '../../components/common/Loading';

const EditarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadCliente, currentCliente, loading, error } = useClientes();
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const fetchCliente = async () => {
      if (id) {
        await loadCliente(parseInt(id));
        setLoaded(true);
      }
    };
    
    fetchCliente();
  }, [id, loadCliente]);
  
  return (
    <Container maxWidth="lg">
      <Loading open={loading && !loaded} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/clientes')}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          Editar Cliente
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loaded && !currentCliente && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Cliente não encontrado. Verifique se o ID está correto.
        </Alert>
      )}
      
      {loaded && currentCliente && (
        <ClienteForm cliente={currentCliente} />
      )}
    </Container>
  );
};

export default EditarCliente;