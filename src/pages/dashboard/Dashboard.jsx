import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Divider
} from '@mui/material';
import {
  AccountCircle as ClienteIcon,
  Description as ContratoIcon,
  Landscape as LoteIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import useClientes from '../../hooks/useClientes';
import useContratos from '../../hooks/useContratos';
import Loading from '../../components/common/Loading';
import { formatCurrency } from '../../utils/formatters';

const Dashboard = () => {
  const { clientes, loading: clientesLoading } = useClientes();
  const { contratos, lotes, loading: contratosLoading } = useContratos();
  
  // Estados para as estatísticas
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
  
  // Calcula as estatísticas quando os dados são carregados
  useEffect(() => {
    if (clientes && contratos && lotes) {
      // Estatísticas dos lotes
      const disponiveis = lotes.filter(l => l.status === 'disponivel').length;
      const reservados = lotes.filter(l => l.status === 'reservado').length;
      const vendidos = lotes.filter(l => l.status === 'vendido').length;
      
      // Estatísticas financeiras
      const valorTotal = contratos.reduce((sum, contrato) => sum + (contrato.valorTotal || 0), 0);
      const valorMedio = contratos.length > 0 ? valorTotal / contratos.length : 0;
      
      setStats({
        totalClientes: clientes.length,
        totalContratos: contratos.length,
        totalLotes: lotes.length,
        lotesDisponiveis: disponiveis,
        lotesReservados: reservados,
        lotesVendidos: vendidos,
        valorTotalContratos: valorTotal,
        valorMedioContratos: valorMedio
      });
    }
  }, [clientes, contratos, lotes]);
  
  return (
    <Container maxWidth="lg">
      <Loading open={clientesLoading || contratosLoading} />
      
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Cards principais */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Card de Clientes */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              borderTop: '4px solid #1976d2'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ClienteIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" color="primary">
                Clientes
              </Typography>
            </Box>
            <Typography variant="h3" component="div">
              {stats.totalClientes}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total de clientes cadastrados
            </Typography>
          </Paper>
        </Grid>
        
        {/* Card de Contratos */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              borderTop: '4px solid #dc004e'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ContratoIcon sx={{ color: 'secondary.main', mr: 1 }} />
              <Typography variant="h6" color="secondary">
                Contratos
              </Typography>
            </Box>
            <Typography variant="h3" component="div">
              {stats.totalContratos}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total de contratos ativos
            </Typography>
          </Paper>
        </Grid>
        
        {/* Card de Lotes */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              borderTop: '4px solid #4caf50'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LoteIcon sx={{ color: '#4caf50', mr: 1 }} />
              <Typography variant="h6" style={{ color: '#4caf50' }}>
                Lotes
              </Typography>
            </Box>
            <Typography variant="h3" component="div">
              {stats.totalLotes}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total de lotes cadastrados
            </Typography>
          </Paper>
        </Grid>
        
        {/* Card de Valores */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              borderTop: '4px solid #f57c00'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MoneyIcon sx={{ color: '#f57c00', mr: 1 }} />
              <Typography variant="h6" style={{ color: '#f57c00' }}>
                Vendas
              </Typography>
            </Box>
            <Typography variant="h6" component="div" fontWeight="bold">
              {formatCurrency(stats.valorTotalContratos)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Valor total em contratos
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Detalhamento de Lotes */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Situação dos Lotes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      bgcolor: '#e3f2fd',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h4" component="div">
                      {stats.lotesDisponiveis}
                    </Typography>
                    <Typography variant="body2">
                      Disponíveis
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      bgcolor: '#fff9c4',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h4" component="div">
                      {stats.lotesReservados}
                    </Typography>
                    <Typography variant="body2">
                      Reservados
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      bgcolor: '#e8f5e9',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h4" component="div">
                      {stats.lotesVendidos}
                    </Typography>
                    <Typography variant="body2">
                      Vendidos
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Estatísticas de Contratos */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estatísticas de Vendas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Valor Médio dos Contratos:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(stats.valorMedioContratos)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Contratos por Cliente:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {stats.totalClientes ? (stats.totalContratos / stats.totalClientes).toFixed(2) : '0.00'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Taxa de Ocupação:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {stats.totalLotes 
                      ? (((stats.lotesReservados + stats.lotesVendidos) / stats.totalLotes) * 100).toFixed(2) 
                      : '0.00'}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Resumo Geral */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resumo Geral
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
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
          O valor total dos contratos é de <strong>{formatCurrency(stats.valorTotalContratos)}</strong>, 
          com um valor médio de <strong>{formatCurrency(stats.valorMedioContratos)}</strong> por contrato.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Dashboard;