import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Tabs, Tab, Divider, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { CalendarMonth, Settings, Assessment, AutoGraph } from '@mui/icons-material';

import FiltragemReajustes from '../../components/reajustes/FiltragemReajustes';
import LogReajustesTable from '../../components/reajustes/LogReajustesTable';
import SimulacaoReajusteModal from '../../components/reajustes/SimulacaoReajusteModal';

import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useReajusteContext } from '../../contexts/ReajusteContext';
import CalendarioReajustes from '../../components/reajustes/CalendarioReajustes';


// Estilos personalizados
const HeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(45deg, #1a1a1a 30%, #2c2c2c 90%)' 
    : 'linear-gradient(45deg, #f7f7f7 30%, #ffffff 90%)',
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  minHeight: '70vh'
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 500,
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const TitleWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const StatusIndicator = styled(Box)(({ theme, status }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: 
    status === 'pendente' 
      ? theme.palette.warning.main 
      : status === 'aplicado' 
        ? theme.palette.success.main 
        : theme.palette.grey[500],
  marginRight: theme.spacing(1),
}));

const StatusCount = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(2),
  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
  fontSize: '0.9rem',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
  fontWeight: 500,
  textTransform: 'none',
  minWidth: 120,
}));

// Componente principal
const ReajustesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
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
    <Box sx={{ 
      padding: isMobile ? theme.spacing(2) : theme.spacing(4),
      maxWidth: '1280px',
      margin: '0 auto'
    }}>
      {/* Cabeçalho */}
      <HeaderPaper>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <TitleWrapper>
              <IconWrapper>
                <AutoGraph />
              </IconWrapper>
              <SectionTitle variant="h1">Reajustes Automáticos</SectionTitle>
            </TitleWrapper>
            <Typography variant="subtitle1" color="textSecondary" sx={{ 
              fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
              mb: 1 
            }}>
              Gerenciamento e aplicação de reajustes contratuais
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: { xs: 'flex-start', md: 'flex-end' }, 
              flexWrap: 'wrap', 
              gap: 1 
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mr: 2,
                flexWrap: 'wrap'
              }}>
                <StatusCount>
                  <StatusIndicator status="pendente" />
                  {reajustesPendentes.length} pendentes
                </StatusCount>
                <StatusCount>
                  <StatusIndicator status="aplicado" />
                  {reajustesAplicados.length} aplicados
                </StatusCount>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Settings />} 
                  onClick={handleNavigateToSettings}
                  sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                  Configurações
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<Assessment />} 
                  onClick={handleAbrirSimulacao}
                  sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                  Simular Reajuste
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </HeaderPaper>
      
      {/* Filtros */}
      <FiltragemReajustes />
      
      {/* Conteúdo principal */}
      <ContentPaper>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="reajustes tabs"
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : "disabled"}
          >
            <StyledTab 
              icon={<CalendarMonth />} 
              iconPosition="start" 
              label="Calendário de Reajustes" 
              id="tab-0" 
              aria-controls="tabpanel-0" 
            />
            <StyledTab 
              icon={<Assessment />} 
              iconPosition="start" 
              label="Log de Reajustes" 
              id="tab-1" 
              aria-controls="tabpanel-1" 
            />
          </Tabs>
        </Box>
        
        {/* Conteúdo das tabs */}
        <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" aria-labelledby="tab-0">
          {tabValue === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
                  fontWeight: 500 
                }}>
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
                <Typography variant="h6" sx={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
                  fontWeight: 500 
                }}>
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
      </ContentPaper>
      
      {/* Modal de Simulação */}
      <SimulacaoReajusteModal 
        open={isSimulacaoOpen} 
        onClose={handleFecharSimulacao} 
      />
    </Box>
  );
};

export default ReajustesPage;