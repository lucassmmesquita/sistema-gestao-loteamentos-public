// src/pages/documentos/QuitacaoPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Alert } from '@mui/material';
import Breadcrumb from '../../components/common/Breadcrumb';
import QuitacaoForm from '../../components/documentos/QuitacaoForm';
import useDocumentosContratuais from '../../hooks/useDocumentosContratuais';
import Loading from '../../components/common/Loading';

const QuitacaoPage = () => {
  const { contratoId, quitacaoId } = useParams();
  const { loadQuitacaoByContrato, loading } = useDocumentosContratuais();
  const [quitacao, setQuitacao] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const loadQuitacao = async () => {
      try {
        if (contratoId && quitacaoId) {
          const quitacaoData = await loadQuitacaoByContrato(parseInt(contratoId));
          
          if (quitacaoData) {
            setQuitacao(quitacaoData);
          } else {
            setError('Quitação não encontrada');
          }
        }
      } catch (err) {
        setError('Erro ao carregar quitação: ' + err.message);
      }
    };
    
    if (quitacaoId && quitacaoId !== 'nova') {
      loadQuitacao();
    }
  }, [contratoId, quitacaoId, loadQuitacaoByContrato]);
  
  return (
    <Container maxWidth="lg">
      <Loading open={loading} />
      <Breadcrumb />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {quitacaoId === 'nova' ? 'Nova Quitação' : 'Editar Quitação'}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {quitacaoId === 'nova' 
            ? 'Adicione uma nova quitação ao contrato' 
            : 'Edite as informações da quitação existente'}
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <QuitacaoForm quitacao={quitacao} />
    </Container>
  );
};

export default QuitacaoPage;