// src/pages/inadimplencia/InadimplenciaPage.jsx
import React, { useState, useEffect } from 'react';
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
  alpha,
  Alert
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

import { InadimplenciaProvider, useInadimplenciaContext } from '../../contexts/InadimplenciaContext';
import ClientesInadimplentesTable from '../../components/inadimplencia/ClientesInadimplentesTable';
import GatilhosAutomaticos from '../../components/inadimplencia/GatilhosAutomaticos';
import EnvioManualCobranca from '../../components/inadimplencia/EnvioManualCobranca';
import Loading from '../../components/common/Loading';

// Wrapper para o conteúdo que usa o contexto
const InadimplenciaContent = () => {
  const [tabAtual, setTabAtual] = useState(0);
  const { 
    clientesInadimplentes,
    loading, 
    error, 
    carregarClientesInadimplentes
  } = useInadimplenciaContext();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Carregar dados quando o componente montar
  useEffect(() => {
    carregarClientesInadimplentes();
  }, [carregarClientesInadimplentes]);
  
  // Função para manipular mudança de tab
  const handleTabChange = (event, newValue) => {
    setTabAtual(newValue);
  };
  
  // Função auxiliar para formatar valores monetários
  const formatarValor = (valor) => {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };
  
  // Função para renderizar os indicadores
  const renderizarIndicadores = () => {
    // Calcular estatísticas de forma segura com base nos dados reais
    const totalClientes = Array.isArray(clientesInadimplentes) ? clientesInadimplentes.length : 0;
    
    let valorTotal = 0;
    let taxaInadimplencia = 0;
    let comunicacoesEnviadas = 0;
    
    if (Array.isArray(clientesInadimplentes)) {
      // Calcular valor total
      valorTotal = clientesInadimplentes.reduce((total, cliente) => {
        if (!cliente || !Array.isArray(cliente.parcelas)) return total;
        
        const valorCliente = cliente.parcelas.reduce((soma, parcela) => {
          if (!parcela || isNaN(parseFloat(parcela.valorAtualizado))) return soma;
          return soma + parseFloat(parcela.valorAtualizado);
        }, 0);
        
        return total + valorCliente;
      }, 0);
      
      // Contar comunicações enviadas se a informação estiver disponível
      comunicacoesEnviadas = clientesInadimplentes.reduce((total, cliente) => {
        if (!cliente || !Array.isArray(cliente.comunicacoes)) return total;
        return total + cliente.comunicacoes.length;
      }, 0);
    }
    
    const indicadores = [
      {
        titulo: 'Clientes Inadimplentes',
        valor: totalClientes.toString(),
        icone: <PeopleIcon sx={{ fontSize: 40 }} color="primary" />,
        variacao: '',
        descricao: 'Total atual',
        corVariacao: theme.palette.text.secondary
      },
      {
        titulo: 'Valor Total em Aberto',
        valor: formatarValor(valorTotal),
        icone: <DashboardIcon sx={{ fontSize: 40 }} color="primary" />,
        variacao: '',
        descricao: 'Total atual',
        corVariacao: theme.palette.text.secondary
      },
      {
        titulo: 'Taxa de Inadimplência',
        // Aqui usamos um valor calculado se disponível, caso contrário N/A
        valor: taxaInadimplencia ? `${taxaInadimplencia.toFixed(2)}%` : 'N/A',
        icone: <Collections sx={{ fontSize: 40 }} color="primary" />,
        variacao: '',
        descricao: 'Calculado sobre contratos ativos',
        corVariacao: theme.palette.text.secondary
      },
      {
        titulo: 'Comunicações Enviadas',
        valor: comunicacoesEnviadas.toString(),
        icone: <Email sx={{ fontSize: 40 }} color="primary" />,
        variacao: '',
        descricao: 'Total de notificações',
        corVariacao: theme.palette.text.secondary
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
                  {indicador.variacao && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: indicador.corVariacao,
                        fontWeight: 500
                      }}
                    >
                      {indicador.variacao}
                    </Typography>
                  )}
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
    <>
      <Loading open={loading} />
      
      {/* Exibir erro, se houver */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
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
          <ClientesInadimplentesTable 
            formatarValor={formatarValor} 
          />
        )}
        
        {tabAtual === 1 && (
          <GatilhosAutomaticos />
        )}
        
        {tabAtual === 2 && (
          <EnvioManualCobranca />
        )}
      </Box>
    </>
  );
};

/**
 * Página principal do módulo de inadimplência
 * @returns {JSX.Element} - Componente renderizado
 */
const InadimplenciaPage = () => {
  return (
    <InadimplenciaProvider>
      <InadimplenciaContent />
    </InadimplenciaProvider>
  );
};

export default InadimplenciaPage;