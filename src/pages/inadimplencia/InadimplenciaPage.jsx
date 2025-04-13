import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
  Grid,
  Card,
  CardContent,
  Stack,
  alpha
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Bolt,
  Email,
  Settings,
  Collections,
  FilterList,
  NotificationsActive
} from '@mui/icons-material';

import { InadimplenciaProvider } from '../../contexts/InadimplenciaContext';
import ClientesInadimplentesTable from '../../components/inadimplencia/ClientesInadimplentesTable';
import GatilhosAutomaticos from '../../components/inadimplencia/GatilhosAutomaticos';
import EnvioManualCobranca from '../../components/inadimplencia/EnvioManualCobranca';

/**
 * Página principal do módulo de inadimplência
 * @returns {JSX.Element} - Componente renderizado
 */
const InadimplenciaPage = () => {
  const [tabAtual, setTabAtual] = useState(0);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Função para manipular mudança de tab
  const handleTabChange = (event, newValue) => {
    setTabAtual(newValue);
  };
  
  // Função para renderizar os indicadores
  const renderizarIndicadores = () => {
    const indicadores = [
      {
        titulo: 'Clientes Inadimplentes',
        valor: '142',
        icone: <PeopleIcon sx={{ fontSize: 40 }} color="primary" />,
        variacao: '+12%',
        descricao: 'Em relação ao mês anterior',
        corVariacao: theme.palette.error.main
      },
      {
        titulo: 'Valor Total em Aberto',
        valor: 'R$ 278.450,00',
        icone: <DashboardIcon sx={{ fontSize: 40 }} color="primary" />,
        variacao: '+8%',
        descricao: 'Em relação ao mês anterior',
        corVariacao: theme.palette.error.main
      },
      {
        titulo: 'Taxa de Inadimplência',
        valor: '8,2%',
        icone: <Collections sx={{ fontSize: 40 }} color="primary" />,
        variacao: '-2%',
        descricao: 'Em relação ao mês anterior',
        corVariacao: theme.palette.success.main
      },
      {
        titulo: 'Comunicações Enviadas',
        valor: '325',
        icone: <Email sx={{ fontSize: 40 }} color="primary" />,
        variacao: '+45%',
        descricao: 'Em relação ao mês anterior',
        corVariacao: theme.palette.error.main
      }
    ];
    
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {indicadores.map((indicador, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack 
                  direction="row" 
                  justifyContent="space-between" 
                  alignItems="flex-start" 
                  sx={{ mb: 2 }}
                >
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    fontSize="1rem"
                    fontWeight="500"
                  >
                    {indicador.titulo}
                  </Typography>
                  {indicador.icone}
                </Stack>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: 600,
                    fontSize: { xs: '2rem', sm: '2.2rem', md: '2.5rem' }
                  }}
                >
                  {indicador.valor}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: indicador.corVariacao,
                      fontWeight: 500
                    }}
                  >
                    {indicador.variacao}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    component="span"
                  >
                    {indicador.descricao}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  return (
    <InadimplenciaProvider>
      {/* Título da página */}
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
          Gestão de Inadimplência
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            component="a"
            href="/inadimplencia/configuracoes"
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
            startIcon={<FilterList />}
            component="a"
            href="/inadimplencia/relatorios"
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
            Relatórios
          </Button>
        </Box>
      </Box>
      
      {/* Indicadores */}
      {renderizarIndicadores()}
      
      {/* Tabs de navegação */}
      <Paper 
        elevation={2} 
        sx={{ 
          mb: 3, 
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Tabs 
          value={tabAtual} 
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
          aria-label="inadimplência tabs"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
              height: 3
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.95rem',
              py: 2
            },
            '& .Mui-selected': {
              color: theme.palette.primary.main,
              fontWeight: 600
            }
          }}
        >
          <Tab 
            label="Clientes Inadimplentes" 
            icon={<NotificationsActive />} 
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
          <Tab 
            label="Gatilhos Automáticos" 
            icon={<Bolt />} 
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
          <Tab 
            label="Envio Manual" 
            icon={<Email />} 
            iconPosition="start"
            sx={{ textTransform: 'none' }}
          />
        </Tabs>
      </Paper>
      
      {/* Conteúdo das tabs */}
      <Box 
        sx={{ 
          mt: 2,
          borderRadius: 2,
          minHeight: '50vh'
        }}
      >
        {tabAtual === 0 && (
          <ClientesInadimplentesTable />
        )}
        
        {tabAtual === 1 && (
          <GatilhosAutomaticos />
        )}
        
        {tabAtual === 2 && (
          <EnvioManualCobranca />
        )}
      </Box>
    </InadimplenciaProvider>
  );
};

export default InadimplenciaPage;