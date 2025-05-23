// src/pages/dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Typography, 
  Box,
  Paper,
  Card,
  CardContent,
  useMediaQuery,
  Divider
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  AccountCircle as ClienteIcon,
  Description as ContratoIcon,
  Landscape as LoteIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

import dashboardService from '../../services/dashboardService';
import Loading from '../../components/common/Loading';
import { formatCurrency } from '../../utils/formatters';
import { AppleDashboardCard, ApplePaper, AppleTitle, AppleSubtitle } from '../../components/common/AppleComponents';

// Styled components
const StatisticWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  }
}));

const formatarValor = (valor) => {
  // Garantir que o valor seja um número
  const valorNumerico = typeof valor === 'string' ? parseFloat(valor) : Number(valor);
  
  // Verificar se é um número válido
  if (isNaN(valorNumerico)) {
    return 'R$ 0,00';
  }
  
  // Limitar a números dentro de um intervalo razoável para evitar overflow
  const valorLimitado = Math.min(valorNumerico, 999999999.99); // Limita a 999 milhões
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valorLimitado);
};

const StatisticLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

const StatisticValue = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
}));

const DashboardSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  
  // States for statistics and loading
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalContratos: 0,
    totalLotes: 0,
    lotesDisponiveis: 0,
    lotesReservados: 0,
    lotesVendidos: 0,
    valorTotalContratos: 0,
    valorMedioContratos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Animation state
  const [animate, setAnimate] = useState(false);
  
  // Fetch dashboard data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardData();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Erro ao carregar dados do dashboard");
        // Mantenha os stats zerados ou com valores padrão em caso de erro
        setStats({
          totalClientes: 0,
          totalContratos: 0,
          totalLotes: 0,
          lotesDisponiveis: 0,
          lotesReservados: 0,
          lotesVendidos: 0,
          valorTotalContratos: 0,
          valorMedioContratos: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []); // Executa apenas na montagem do componente

  // Animate on mount after data is loaded
  useEffect(() => {
    if (!loading) {
      // Allow a short delay for rendering before animating
      setTimeout(() => {
        setAnimate(true);
      }, 100); 
    }
  }, [loading]);
  
  return (
    <Box
      sx={{
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease',
      }}
    >
      <Loading open={loading} />
      
      <AppleTitle sx={{ mb: 4 }}>Tela Inicial</AppleTitle>
      
      {/* Main Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Clients Card */}
        <Grid item xs={12} sm={6} md={3} 
          sx={{ 
            animation: animate ? 'fadeInUp 0.5s ease forwards' : 'none',
            animationDelay: '0.1s',
            opacity: 0,
            '@keyframes fadeInUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          <AppleDashboardCard
            title="Clientes"
            value={stats.totalClientes}
            icon={<ClienteIcon fontSize="large" />}
            colorClass="primary"
          />
        </Grid>
        
        {/* Contracts Card */}
        <Grid item xs={12} sm={6} md={3}
          sx={{ 
            animation: animate ? 'fadeInUp 0.5s ease forwards' : 'none',
            animationDelay: '0.2s',
            opacity: 0
          }}
        >
          <AppleDashboardCard
            title="Contratos"
            value={stats.totalContratos}
            icon={<ContratoIcon fontSize="large" />}
            colorClass="secondary"
          />
        </Grid>
        
        {/* Lots Card */}
        <Grid item xs={12} sm={6} md={3}
          sx={{ 
            animation: animate ? 'fadeInUp 0.5s ease forwards' : 'none',
            animationDelay: '0.3s',
            opacity: 0
          }}
        >
          <AppleDashboardCard
            title="Lotes"
            value={stats.totalLotes}
            icon={<LoteIcon fontSize="large" />}
            colorClass="success"
          />
        </Grid>
        
        {/* Sales Value Card */}
        <Grid item xs={12} sm={6} md={3}
          sx={{ 
            animation: animate ? 'fadeInUp 0.5s ease forwards' : 'none',
            animationDelay: '0.4s',
            opacity: 0
          }}
        >
          <AppleDashboardCard
            title="Vendas"
            value={formatarValor(stats.valorTotalContratos)}
            icon={<MoneyIcon fontSize="medium" />}
            colorClass="warning"
          />
        </Grid>
      </Grid>
      
      {/* Detailed Sections */}
      <Grid container spacing={4}>
        {/* Lot Status Section */}
        <Grid item xs={12} md={6}
          sx={{ 
            animation: animate ? 'fadeInUp 0.6s ease forwards' : 'none',
            animationDelay: '0.5s',
            opacity: 0
          }}
        >
          <ApplePaper>
            <DashboardSectionTitle>
              <LoteIcon sx={{ color: theme.palette.success.main }} />
              Situação dos Lotes
            </DashboardSectionTitle>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Card
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 3,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Typography variant="h4" component="div" fontWeight={700} sx={{ mb: 1 }}>
                    {stats.lotesDisponiveis}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Disponíveis
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 3,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Typography variant="h4" component="div" fontWeight={700} sx={{ mb: 1 }}>
                    {stats.lotesReservados}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Reservados
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 3,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Typography variant="h4" component="div" fontWeight={700} sx={{ mb: 1 }}>
                    {stats.lotesVendidos}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Vendidos
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </ApplePaper>
        </Grid>
        
        {/* Sales Statistics Section */}
        <Grid item xs={12} md={6}
          sx={{ 
            animation: animate ? 'fadeInUp 0.6s ease forwards' : 'none',
            animationDelay: '0.6s',
            opacity: 0
          }}
        >
          <ApplePaper>
            <DashboardSectionTitle>
              <MoneyIcon sx={{ color: theme.palette.warning.main }} />
              Estatísticas de Vendas
            </DashboardSectionTitle>
            <Divider sx={{ mb: 3 }} />
            
            <Box>
              <StatisticWrapper>
                <StatisticLabel variant="body1">Valor Médio dos Contratos:</StatisticLabel>
                <StatisticValue variant="body1">
                  {formatarValor(stats.valorMedioContratos)}
                </StatisticValue>
              </StatisticWrapper>
              
              <StatisticWrapper>
                <StatisticLabel variant="body1">Contratos por Cliente:</StatisticLabel>
                <StatisticValue variant="body1">
                  {stats.totalClientes ? (stats.totalContratos / stats.totalClientes).toFixed(2) : '0.00'}
                </StatisticValue>
              </StatisticWrapper>
              
              <StatisticWrapper>
                <StatisticLabel variant="body1">Taxa de Ocupação:</StatisticLabel>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StatisticValue variant="body1" sx={{ mr: 1 }}>
                    {stats.totalLotes 
                      ? (((stats.lotesReservados + stats.lotesVendidos) / stats.totalLotes) * 100).toFixed(2) 
                      : '0.00'}%
                  </StatisticValue>
                  <TrendingUpIcon sx={{ color: theme.palette.success.main }} />
                </Box>
              </StatisticWrapper>
              
              <StatisticWrapper>
                <StatisticLabel variant="body1">Valor Médio por Lote:</StatisticLabel>
                <StatisticValue variant="body1">
                  {formatarValor(
                    (stats.lotesReservados + stats.lotesVendidos) > 0 
                      ? stats.valorTotalContratos / (stats.lotesReservados + stats.lotesVendidos)
                      : 0
                  )}
                </StatisticValue>
              </StatisticWrapper>
            </Box>
          </ApplePaper>
        </Grid>
      </Grid>
      
      {/* Summary Section */}
      <Box
        sx={{ 
          mt: 4,
          animation: animate ? 'fadeInUp 0.6s ease forwards' : 'none',
          animationDelay: '0.7s',
          opacity: 0
        }}
      >
        <ApplePaper>
          <DashboardSectionTitle>
            <ContratoIcon sx={{ color: theme.palette.secondary.main }} />
            Resumo Geral
          </DashboardSectionTitle>
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="body1" paragraph>
            O sistema atualmente gerencia <strong>{stats.totalClientes}</strong> clientes, 
            <strong> {stats.totalContratos}</strong> contratos ativos e 
            <strong> {stats.totalLotes}</strong> lotes.
          </Typography>
          
          <Typography variant="body1" paragraph>
            Do total de lotes, <strong>{stats.lotesDisponiveis}</strong> estão disponíveis para venda, 
            <strong> {stats.lotesReservados}</strong> estão reservados e 
            <strong> {stats.lotesVendidos}</strong> foram vendidos.
          </Typography>
          
          <Typography variant="body1">
            O valor total dos contratos é de <strong>{formatarValor(stats.valorTotalContratos)}</strong>, 
            com um valor médio de <strong>{formatarValor(stats.valorMedioContratos)}</strong> por contrato.
          </Typography>
        </ApplePaper>
      </Box>
    </Box>
  );
};

export default Dashboard;