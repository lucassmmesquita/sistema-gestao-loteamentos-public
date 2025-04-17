// src/components/reajustes/ReajusteVisualizador.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  Grid, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Button,
  useTheme
} from '@mui/material';
import { 
  TrendingUp, 
  CalendarMonth, 
  AttachMoney,
  History 
} from '@mui/icons-material';
import useReajuste from '../../hooks/useReajuste';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '../../utils/formatters';

/**
 * Componente para visualização detalhada de reajustes de um contrato
 * @param {Object} props - Propriedades do componente
 * @param {number} props.contratoId - ID do contrato
 * @param {Object} props.contrato - Dados do contrato (opcional)
 * @param {boolean} props.showActions - Exibir botões de ação
 * @param {Function} props.onApplyReajuste - Callback ao aplicar reajuste
 * @returns {JSX.Element} - Componente renderizado
 */
const ReajusteVisualizador = ({ contratoId, contrato, showActions = true, onApplyReajuste }) => {
  const theme = useTheme();
  const { 
    historicoReajustes, 
    indicesEconomicos, 
    loading, 
    error, 
    aplicarReajuste, 
    simularReajuste,
    carregarHistoricoReajustes
  } = useReajuste(contratoId);
  
  const [simulacao, setSimulacao] = useState(null);
  const [loadingSimulacao, setLoadingSimulacao] = useState(false);
  
  // Executar simulação quando o componente montar
  useEffect(() => {
    const executarSimulacao = async () => {
      if (contratoId) {
        setLoadingSimulacao(true);
        try {
          const resultado = await simularReajuste();
          setSimulacao(resultado);
        } catch (error) {
          console.error('Erro ao simular reajuste:', error);
        } finally {
          setLoadingSimulacao(false);
        }
      }
    };
    
    executarSimulacao();
  }, [contratoId, simularReajuste]);
  
  // Manipulador para aplicar reajuste
  const handleAplicarReajuste = async () => {
    const reajusteAplicado = await aplicarReajuste();
    if (reajusteAplicado && onApplyReajuste) {
      onApplyReajuste(reajusteAplicado);
    }
  };
  
  // Função para formatar data
  const formatarData = (data) => {
    if (!data) return '';
    const dataObj = typeof data === 'string' ? new Date(data) : data;
    return format(dataObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };
  
  return (
    <Box>
      {/* Exibir erro se houver */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Resumo da simulação */}
      {simulacao && (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '6px',
              height: '100%',
              backgroundColor: theme.palette.primary.main
            }
          }}
        >
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            Próximo Reajuste Previsto
          </Typography>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Contrato
                </Typography>
                <Typography variant="h6">
                  {simulacao.contrato?.numero || `#${simulacao.contratoId}`}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Data de Referência
                </Typography>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonth fontSize="small" color="primary" />
                  {formatarData(simulacao.dataReferencia)}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Parcela de Referência
                </Typography>
                <Typography variant="h6">
                  {simulacao.proximaParcelaReajuste}ª parcela
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Índice Base
                </Typography>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp fontSize="small" color="primary" />
                  {simulacao.indiceBase}: {simulacao.indiceAplicado.toFixed(2)}%
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Percentual Total de Reajuste
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary">
                  {simulacao.reajusteTotal.toFixed(2)}%
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Valor Reajustado
                </Typography>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney fontSize="small" color="primary" />
                  {formatCurrency(simulacao.valorReajustado)}
                  <Chip 
                    size="small" 
                    color="success" 
                    label={`+${formatCurrency(simulacao.valorReajustado - simulacao.valorOriginal)}`}
                  />
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {showActions && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAplicarReajuste}
                disabled={loading || loadingSimulacao}
                sx={{ 
                  px: 3, 
                  py: 1, 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
              >
                Aplicar Reajuste
              </Button>
            </Box>
          )}
        </Paper>
      )}
      
      {/* Histórico de reajustes */}
      {historicoReajustes && historicoReajustes.length > 0 && (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '6px',
              height: '100%',
              backgroundColor: theme.palette.secondary.main
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <History color="secondary" />
            <Typography variant="h5" fontWeight={600}>
              Histórico de Reajustes
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Parcela</TableCell>
                  <TableCell>Índice</TableCell>
                  <TableCell>Percentual</TableCell>
                  <TableCell align="right">Valor Original</TableCell>
                  <TableCell align="right">Valor Reajustado</TableCell>
                  <TableCell align="right">Diferença</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historicoReajustes.map((reajuste) => (
                  <TableRow key={reajuste.id}>
                    <TableCell>{formatarData(reajuste.dataReferencia)}</TableCell>
                    <TableCell>{reajuste.parcelaReferencia}ª</TableCell>
                    <TableCell>{reajuste.indiceBase}</TableCell>
                    <TableCell>{reajuste.reajusteTotal.toFixed(2)}%</TableCell>
                    <TableCell align="right">{formatCurrency(reajuste.valorOriginal)}</TableCell>
                    <TableCell align="right">{formatCurrency(reajuste.valorReajustado)}</TableCell>
                    <TableCell align="right">
                      <Chip 
                        size="small" 
                        color="success" 
                        label={`+${formatCurrency(reajuste.valorReajustado - reajuste.valorOriginal)}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      
      {/* Mensagem quando não há histórico de reajustes */}
      {!loading && (!historicoReajustes || historicoReajustes.length === 0) && (
        <Alert 
          severity="info" 
          sx={{ mt: 3, borderRadius: 2 }}
        >
          Este contrato ainda não possui reajustes aplicados.
        </Alert>
      )}
    </Box>
  );
};

export default ReajusteVisualizador;