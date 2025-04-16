// src/pages/boletos/BoletosDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, 
  Container, 
  Box, 
  Button, 
  Alert, 
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import VisualizarBoleto from '../../components/boletos/VisualizarBoleto';
import useBoletos from '../../hooks/useBoletos';
import Loading from '../../components/common/Loading';

const BoletosDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { loadBoleto, currentBoleto, loading, error } = useBoletos();
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const fetchBoleto = async () => {
      if (id) {
        await loadBoleto(parseInt(id));
        setLoaded(true);
      }
    };
    
    fetchBoleto();
  }, [id, loadBoleto]);
  
  return (
    <Container maxWidth="lg">
      <Loading open={loading && !loaded} />
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? 2 : 0
      }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/boletos')}
          sx={{ 
            mr: isMobile ? 0 : 2,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              transform: 'translateY(-2px)',
              transition: 'transform 0.2s ease'
            }
          }}
        >
          Voltar
        </Button>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}
        >
          Detalhes do Boleto
        </Typography>
      </Box>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2
          }}
        >
          {error}
        </Alert>
      )}
      
      {loaded && !currentBoleto && (
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3,
            borderRadius: 2
          }}
        >
          Boleto não encontrado. Verifique se o ID está correto.
        </Alert>
      )}
      
      {loaded && currentBoleto && (
        <Paper 
          sx={{ 
            width: '100%', 
            p: 3,
            borderRadius: 2, 
            overflow: 'hidden',
            boxShadow: 2,
            animation: 'fadeIn 0.5s ease-in-out',
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          <VisualizarBoleto boleto={currentBoleto} />
        </Paper>
      )}
    </Container>
  );
};

export default BoletosDetails;