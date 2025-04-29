// src/pages/contratos/MeusContratosVendedor.jsx

import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper } from '@mui/material';
import useContratos from '../../hooks/useContratos';
import ContratoList from '../../components/contratos/ContratoList';
import Loading from '../../components/common/Loading';

const MeusContratosVendedor = () => {
  const { loadContratosByVendedor, contratosFiltrados, loading, error } = useContratos();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchContratos = async () => {
      await loadContratosByVendedor();
      setLoaded(true);
    };

    fetchContratos();
  }, [loadContratosByVendedor]);

  return (
    <Box>
      <Loading open={loading && !loaded} />
      
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          fontSize: { xs: '1.75rem', md: '2.125rem' },
          mb: 3
        }}
      >
        Meus Contratos
      </Typography>
      
      {error && (
        <Paper 
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: 'error.light', 
            color: 'error.contrastText' 
          }}
        >
          {error}
        </Paper>
      )}
      
      <ContratoList 
        contratos={contratosFiltrados} 
        mode="vendedor"
      />
    </Box>
  );
};

export default MeusContratosVendedor;