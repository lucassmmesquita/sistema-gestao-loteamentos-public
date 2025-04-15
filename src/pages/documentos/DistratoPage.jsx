// src/pages/documentos/DistratoPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Alert } from '@mui/material';
import Breadcrumb from '../../components/common/Breadcrumb';
import DistratoForm from '../../components/documentos/DistratoForm';
import useDocumentosContratuais from '../../hooks/useDocumentosContratuais';
import Loading from '../../components/common/Loading';

const DistratoPage = () => {
  const { contratoId, distratoId } = useParams();
  const { loadDistratosByContrato, loading } = useDocumentosContratuais();
  const [distrato, setDistrato] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const loadDistrato = async () => {
      try {
        if (contratoId && distratoId) {
          const distratos = await loadDistratosByContrato(parseInt(contratoId));
          const foundDistrato = distratos.find(d => d.id === parseInt(distratoId));
          
          if (foundDistrato) {
            setDistrato(foundDistrato);
          } else {
            setError('Distrato não encontrado');
          }
        }
      } catch (err) {
        setError('Erro ao carregar distrato: ' + err.message);
      }
    };
    
    if (distratoId && distratoId !== 'novo') {
      loadDistrato();
    }
  }, [contratoId, distratoId, loadDistratosByContrato]);
  
  return (
    <Container maxWidth="lg">
      <Loading open={loading} />
      <Breadcrumb />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {distratoId === 'novo' ? 'Novo Distrato' : 'Editar Distrato'}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {distratoId === 'novo' 
            ? 'Adicione um novo distrato ao contrato' 
            : 'Edite as informações do distrato existente'}
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <DistratoForm distrato={distrato} />
    </Container>
  );
};

export default DistratoPage;