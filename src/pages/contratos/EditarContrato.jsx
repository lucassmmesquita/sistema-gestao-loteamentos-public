// src/pages/contratos/EditarContrato.jsx - Atualizando para passar o contratoId para o ContratoTreeView
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Container, Alert, Button, Box, Tabs, Tab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContratoForm from '../../components/contratos/ContratoForm';
import ContratoTreeView from '../../components/documentos/ContratoTreeView';
import useContratos from '../../hooks/useContratos';
import Loading from '../../components/common/Loading';

const EditarContrato = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadContrato, currentContrato, loading, error } = useContratos();
  const [loaded, setLoaded] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    const fetchContrato = async () => {
      if (id) {
        await loadContrato(parseInt(id));
        setLoaded(true);
      }
    };
    
    fetchContrato();
  }, [id, loadContrato]);
  
  // Manipulador para mudança de abas
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
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
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Detalhes do Contrato" />
              <Tab label="Documentos Associados" />
            </Tabs>
          </Box>
          
          {tabValue === 0 ? (
            <ContratoForm contrato={currentContrato} />
          ) : (
            <ContratoTreeView contratoId={parseInt(id)} />
          )}
        </>
      )}
    </Container>
  );
};

export default EditarContrato;