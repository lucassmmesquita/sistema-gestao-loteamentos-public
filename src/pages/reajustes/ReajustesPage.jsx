// src/pages/reajustes/ReajustesPage.jsx
import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Tabs, Tab, Divider, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { CalendarMonth, Settings, Assessment, AutoGraph } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useReajusteContext } from '../../contexts/ReajusteContext';
import FiltragemReajustes from '../../components/reajustes/FiltragemReajustes';
import LogReajustesTable from '../../components/reajustes/LogReajustesTable';
import SimulacaoReajusteModal from '../../components/reajustes/SimulacaoReajusteModal';
import CalendarioReajustes from '../../components/reajustes/CalendarioReajustes';

// Estilos personalizados mantidos...

const ReajustesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados
  const [tabValue, setTabValue] = useState(0);
  const [isSimulacaoOpen, setSimulacaoOpen] = useState(false);
  
  // Context
  const { 
    reajustes, 
    reajustesPendentes, 
    reajustesAplicados, 
    loading,
    executarReajuste 
  } = useReajusteContext();
  
  // Handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleAbrirSimulacao = () => {
    setSimulacaoOpen(true);
  };
  
  const handleFecharSimulacao = () => {
    setSimulacaoOpen(false);
  };
  
  const handleNavigateToSettings = () => {
    navigate('/reajustes/configuracao');
  };

  const dataAtual = format(new Date(), "MMMM 'de' yyyy", { locale: ptBR });
  
  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        mb: 4,
        gap: isMobile ? 2 : 0
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}
        >
          Gestão de Reajustes
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={handleNavigateToSettings}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none',
              fontWeight: 500 
            }}
          >
            Configurações
          </Button>
          <Button
            variant="contained"
            startIcon={<Assessment />}
            onClick={handleAbrirSimulacao}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none',
              fontWeight: 500,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                transform: 'translateY(-2px)'
              }
            }}
          >
            Simular Reajuste
          </Button>
        </Box>
      </Box>
      
      {/* Restante do código mantido... */}
      
      {/* Filtros */}
      <FiltragemReajustes />
      
      {/* Conteúdo principal */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="reajustes tabs"
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : "disabled"}
          >
            <Tab 
              icon={<CalendarMonth />} 
              iconPosition="start" 
              label="Calendário de Reajustes" 
              id="tab-0" 
              aria-controls="tabpanel-0" 
              sx={{ textTransform: 'none' }}
            />
            <Tab 
              icon={<Assessment />} 
              iconPosition="start" 
              label="Log de Reajustes" 
              id="tab-1" 
              aria-controls="tabpanel-1" 
              sx={{ textTransform: 'none' }}
            />
          </Tabs>
        </Box>
        
        {/* Conteúdo das tabs */}
        <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" aria-labelledby="tab-0">
          {tabValue === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Calendário de Reajustes - {dataAtual}
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <CalendarioReajustes />
            </Box>
          )}
        </Box>
        
        <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" aria-labelledby="tab-1">
          {tabValue === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Histórico de Reajustes Aplicados
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <LogReajustesTable 
                reajustes={reajustes} 
                loading={loading} 
                executarReajuste={executarReajuste}
              />
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Modal de Simulação */}
      <SimulacaoReajusteModal 
        open={isSimulacaoOpen} 
        onClose={handleFecharSimulacao} 
      />
    </Box>
  );
};

export default ReajustesPage;