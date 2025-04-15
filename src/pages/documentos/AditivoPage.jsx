// src/pages/documentos/AditivoPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Alert } from '@mui/material';
import Breadcrumb from '../../components/common/Breadcrumb';
import AditivoForm from '../../components/documentos/AditivoForm';
import useDocumentosContratuais from '../../hooks/useDocumentosContratuais';
import Loading from '../../components/common/Loading';

const AditivoPage = () => {
  const { contratoId, aditivoId } = useParams();
  const { loadAditivosByContrato, loading } = useDocumentosContratuais();
  const [aditivo, setAditivo] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const loadAditivo = async () => {
      try {
        if (contratoId && aditivoId) {
          const aditivos = await loadAditivosByContrato(parseInt(contratoId));
          const foundAditivo = aditivos.find(a => a.id === parseInt(aditivoId));
          
          if (foundAditivo) {
            setAditivo(foundAditivo);
          } else {
            setError('Aditivo não encontrado');
          }
        }
      } catch (err) {
        setError('Erro ao carregar aditivo: ' + err.message);
      }
    };
    
    if (aditivoId && aditivoId !== 'novo') {
      loadAditivo();
    }
  }, [contratoId, aditivoId, loadAditivosByContrato]);
  
  return (
    <Container maxWidth="lg">
      <Loading open={loading} />
      <Breadcrumb />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {aditivoId === 'novo' ? 'Novo Aditivo' : 'Editar Aditivo'}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {aditivoId === 'novo' 
            ? 'Adicione um novo aditivo ao contrato' 
            : 'Edite as informações do aditivo existente'}
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <AditivoForm aditivo={aditivo} />
    </Container>
  );
};

export default AditivoPage;