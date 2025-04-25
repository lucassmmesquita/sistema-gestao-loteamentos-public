// src/pages/lotes/EditarLote.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Alert, Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoteForm from '../../components/lotes/LoteForm';
import useLotes from '../../hooks/useLotes';
import Loading from '../../components/common/Loading';

const EditarLote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadLote, currentLote, loading, error } = useLotes();
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const fetchLote = async () => {
      if (id) {
        await loadLote(parseInt(id));
        setLoaded(true);
      }
    };
    
    fetchLote();
  }, [id, loadLote]);
  
  return (
    <Box>
      <Loading open={loading && !loaded} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/lotes')}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          Editar Lote
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loaded && !currentLote && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Lote não encontrado. Verifique se o ID está correto.
        </Alert>
      )}
      
      {loaded && currentLote && (
        <LoteForm lote={currentLote} />
      )}
    </Box>
  );
};

export default EditarLote;