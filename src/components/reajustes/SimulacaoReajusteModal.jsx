import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, Button, 
    Typography, Box, Divider, Grid, TextField, MenuItem, 
    CircularProgress, Paper, FormControl, InputLabel, Select,
    FormHelperText, Alert, Autocomplete, InputAdornment,
    useMediaQuery, Slider, Tooltip, IconButton // Adicione IconButton aqui
  } from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { 
  Close, Calculate, CalculateOutlined, TrendingUp, 
  CalendarMonth, Description, Payments
} from '@mui/icons-material';
import { format, parseISO, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useReajusteContext } from '../../contexts/ReajusteContext';
import axios from 'axios';

// URL base da API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Estilos personalizados
const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.5) 
    : alpha(theme.palette.background.paper, 0.5),
  border: `1px solid ${theme.palette.divider}`,
  height: '100%',
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const ResultBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.7) 
    : '#f5f5f7',
  border: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  overflow: 'hidden',
}));

const ResultTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  marginBottom: theme.spacing(1),
  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const ValueLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: theme.spacing(0.5),
  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const ValueAmount = styled(Typography)(({ theme, isOriginal, isReajustado }) => ({
  fontSize: isOriginal ? '1.25rem' : '1.5rem',
  fontWeight: isReajustado ? 600 : 400,
  color: isReajustado ? theme.palette.primary.main : theme.palette.text.primary,
  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const ReajusteArrow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: 40,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    height: 2,
    width: '80%',
    backgroundColor: theme.palette.divider,
    top: '50%',
    left: '10%',
    transform: 'translateY(-50%)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    height: 10,
    width: 10,
    backgroundColor: theme.palette.divider,
    top: '50%',
    right: '10%',
    transform: 'translateY(-50%) rotate(45deg)',
    borderTop: `2px solid ${theme.palette.divider}`,
    borderRight: `2px solid ${theme.palette.divider}`,
  },
}));

const ReajustePercentage = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(0.5, 1),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: '0.875rem',
  color: theme.palette.primary.main,
  fontWeight: 600,
  zIndex: 1,
  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

// Componente principal
const SimulacaoReajusteModal = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { executarSimulacao, parametrosReajuste, loading } = useReajusteContext();
  
  // Estados
  const [contratosOptions, setContratosOptions] = useState([]);
  const [indicesOptions, setIndicesOptions] = useState([
    { id: 'IGPM', label: 'IGPM', valor: 5.5 },
    { id: 'IPCA', label: 'IPCA', valor: 4.2 },
    { id: 'INPC', label: 'INPC', valor: 3.8 }
  ]);
  const [contratoSelecionado, setContratoSelecionado] = useState(null);
  const [parametrosSimulacao, setParametrosSimulacao] = useState({
    indiceBase: 'IGPM',
    percentualAdicional: 6,
    valorIndice: 5.5
  });
  const [resultado, setResultado] = useState(null);
  const [loadingSimulacao, setLoadingSimulacao] = useState(false);
  const [error, setError] = useState(null);
  
  // Efeito para carregar contratos
  useEffect(() => {
    const carregarContratos = async () => {
      try {
        const response = await axios.get(`${API_URL}/contratos?status=ativo`);
        
        // Para cada contrato, buscar informações do cliente
        const contratosComCliente = await Promise.all(
          response.data.map(async (contrato) => {
            try {
              const clienteResponse = await axios.get(`${API_URL}/clientes/${contrato.clienteId}`);
              const cliente = clienteResponse.data;
              
              return {
                id: contrato.id,
                label: `Contrato #${contrato.numero} - ${cliente.nome}`,
                numero: contrato.numero,
                valor: contrato.valorParcela,
                dataInicio: contrato.dataInicio,
                parcelasPagas: contrato.parcelasPagas || 0,
                totalParcelas: contrato.totalParcelas,
                cliente: {
                  id: cliente.id,
                  nome: cliente.nome,
                  documento: cliente.cpfCnpj
                }
              };
            } catch (error) {
              return {
                id: contrato.id,
                label: `Contrato #${contrato.numero}`,
                numero: contrato.numero,
                valor: contrato.valorParcela,
                dataInicio: contrato.dataInicio,
                parcelasPagas: contrato.parcelasPagas || 0,
                totalParcelas: contrato.totalParcelas
              };
            }
          })
        );
        
        setContratosOptions(contratosComCliente);
      } catch (error) {
        console.error('Erro ao carregar contratos:', error);
        setError('Não foi possível carregar a lista de contratos.');
      }
    };
    
    if (open) {
      carregarContratos();
      
      // Carrega valores padrão dos parâmetros
      setParametrosSimulacao({
        indiceBase: parametrosReajuste.indiceBase,
        percentualAdicional: parametrosReajuste.percentualAdicional,
        valorIndice: indicesOptions.find(i => i.id === parametrosReajuste.indiceBase)?.valor || 5.5
      });
    }
  }, [open, parametrosReajuste]);
  
  // Handlers
  const handleContratoChange = (event, newValue) => {
    setContratoSelecionado(newValue);
    setResultado(null); // Limpa resultado quando muda o contrato
  };
  
  const handleIndiceChange = (event) => {
    const indice = event.target.value;
    const valorIndice = indicesOptions.find(i => i.id === indice)?.valor || 5.5;
    
    setParametrosSimulacao({
      ...parametrosSimulacao,
      indiceBase: indice,
      valorIndice
    });
  };
  
  const handlePercentualChange = (event, newValue) => {
    setParametrosSimulacao({
      ...parametrosSimulacao,
      percentualAdicional: newValue
    });
  };
  
  const handleValorIndiceChange = (event) => {
    setParametrosSimulacao({
      ...parametrosSimulacao,
      valorIndice: parseFloat(event.target.value) || 0
    });
  };
  
  const handleSimular = async () => {
    if (!contratoSelecionado) {
      setError('Selecione um contrato para simular o reajuste.');
      return;
    }
    
    setLoadingSimulacao(true);
    setError(null);
    
    try {
      const params = {
        indiceBase: parametrosSimulacao.indiceBase,
        percentualAdicional: parametrosSimulacao.percentualAdicional,
        valorIndice: parametrosSimulacao.valorIndice
      };
      
      const simulacao = await executarSimulacao(contratoSelecionado.id, params);
      setResultado(simulacao);
    } catch (error) {
      console.error('Erro ao simular reajuste:', error);
      setError('Não foi possível simular o reajuste. Tente novamente.');
      setResultado(null);
    } finally {
      setLoadingSimulacao(false);
    }
  };
  
  const handleReset = () => {
    setContratoSelecionado(null);
    setParametrosSimulacao({
      indiceBase: parametrosReajuste.indiceBase,
      percentualAdicional: parametrosReajuste.percentualAdicional,
      valorIndice: indicesOptions.find(i => i.id === parametrosReajuste.indiceBase)?.valor || 5.5
    });
    setResultado(null);
    setError(null);
  };
  
  // Formatar valores para exibição
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };
  
  const formatarData = (data) => {
    if (!data) return '';
    try {
      const dataObj = typeof data === 'string' ? parseISO(data) : data;
      return format(dataObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };
  
  const formatarPercentual = (valor) => {
    return `${valor.toFixed(2)}%`;
  };
  
  const calcularReajusteTotal = () => {
    return parametrosSimulacao.valorIndice + parametrosSimulacao.percentualAdicional;
  };
  
  // Verifica se pode aplicar reajuste
  const isFormValid = contratoSelecionado && 
                     parametrosSimulacao.indiceBase &&
                     parametrosSimulacao.valorIndice > 0;
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : theme.shape.borderRadius,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Calculate color="primary" />
          <Typography variant="h6" sx={{ 
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Roboto, sans-serif', 
            fontWeight: 500 
          }}>
            Simulação de Reajuste
          </Typography>
        </Box>
        
        <IconButton edge="end" onClick={onClose} aria-label="close">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Seleção de contrato */}
          <Grid item xs={12}>
            <InfoCard>
              <CardTitle variant="subtitle1">
                <Description fontSize="small" color="primary" />
                Selecione o Contrato
              </CardTitle>
              <Divider sx={{ mb: 2 }} />
              
              <Autocomplete
                options={contratosOptions}
                getOptionLabel={(option) => option.label}
                value={contratoSelecionado}
                onChange={handleContratoChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Contrato"
                    variant="outlined"
                    placeholder="Busque pelo número ou nome do cliente"
                    fullWidth
                    error={!!error && !contratoSelecionado}
                    helperText={!contratoSelecionado && error ? 'Selecione um contrato' : ''}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <Description fontSize="small" />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
              
              {contratoSelecionado && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                          Número do Contrato
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {contratoSelecionado.numero}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                          Valor Atual da Parcela
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatarValor(contratoSelecionado.valor)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                          Parcelas Pagas
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {contratoSelecionado.parcelasPagas} de {contratoSelecionado.totalParcelas}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                          Data de Início
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatarData(contratoSelecionado.dataInicio)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </InfoCard>
          </Grid>
          
          {/* Parâmetros do reajuste */}
          <Grid item xs={12}>
            <InfoCard>
              <CardTitle variant="subtitle1">
                <Calculate fontSize="small" color="primary" />
                Parâmetros do Reajuste
              </CardTitle>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="indice-label">Índice Econômico</InputLabel>
                    <Select
                      labelId="indice-label"
                      value={parametrosSimulacao.indiceBase}
                      onChange={handleIndiceChange}
                      label="Índice Econômico"
                    >
                      {indicesOptions.map((indice) => (
                        <MenuItem key={indice.id} value={indice.id}>
                          {indice.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      Selecione o índice econômico para o reajuste
                    </FormHelperText>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Valor do Índice (%)"
                    type="number"
                    value={parametrosSimulacao.valorIndice}
                    onChange={handleValorIndiceChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TrendingUp fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      )
                    }}
                    inputProps={{
                      min: 0,
                      step: 0.01
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ px: 1 }}>
                    <Typography 
                      id="percentual-adicional-slider" 
                      gutterBottom
                      variant="body2"
                      color="textSecondary"
                    >
                      Percentual Adicional: {parametrosSimulacao.percentualAdicional}%
                    </Typography>
                    <Slider
                      value={parametrosSimulacao.percentualAdicional}
                      onChange={handlePercentualChange}
                      aria-labelledby="percentual-adicional-slider"
                      valueLabelDisplay="auto"
                      step={0.5}
                      marks
                      min={0}
                      max={10}
                      valueLabelFormat={(value) => `${value}%`}
                    />
                    <FormHelperText>
                      Percentual adicional sobre o índice (0% a 10%)
                    </FormHelperText>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Alert 
                    severity="info" 
                    icon={<Calculate />}
                    sx={{ borderRadius: '8px' }}
                  >
                    <Typography variant="body2">
                      Reajuste Total: <strong>{formatarPercentual(calcularReajusteTotal())}</strong> ({parametrosSimulacao.indiceBase}: {formatarPercentual(parametrosSimulacao.valorIndice)} + Adicional: {formatarPercentual(parametrosSimulacao.percentualAdicional)})
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </InfoCard>
          </Grid>
          
          {/* Resultado da simulação */}
          {resultado && (
            <Grid item xs={12}>
              <ResultBox>
                <ResultTitle variant="h6">
                  Resultado da Simulação
                </ResultTitle>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={5}>
                    <Box sx={{ textAlign: 'center' }}>
                      <ValueLabel>Valor Original</ValueLabel>
                      <ValueAmount isOriginal>
                        {formatarValor(resultado.valorOriginal)}
                      </ValueAmount>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <ReajusteArrow>
                      <ReajustePercentage>
                        <Calculate fontSize="small" />
                        {formatarPercentual(resultado.reajusteTotal)}
                      </ReajustePercentage>
                    </ReajusteArrow>
                  </Grid>
                  
                  <Grid item xs={12} sm={5}>
                    <Box sx={{ textAlign: 'center' }}>
                      <ValueLabel>Valor Reajustado</ValueLabel>
                      <ValueAmount isReajustado>
                        {formatarValor(resultado.valorReajustado)}
                      </ValueAmount>
                    </Box>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 3 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Parcela de Referência
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        #{resultado.proximaParcelaReajuste}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Data de Referência
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatarData(resultado.dataReferencia)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2 }}>
                  <Alert severity="success" sx={{ borderRadius: '8px' }}>
                    <Typography variant="body2">
                      Diferença de Valor: <strong>{formatarValor(resultado.valorReajustado - resultado.valorOriginal)}</strong> por parcela
                    </Typography>
                  </Alert>
                </Box>
              </ResultBox>
            </Grid>
          )}
          
          {error && !resultado && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ borderRadius: '8px' }}>
                {error}
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button 
          onClick={handleReset}
          variant="outlined"
          disabled={loadingSimulacao}
          color="inherit"
          sx={{ borderRadius: '8px', textTransform: 'none' }}
        >
          Limpar
        </Button>
        
        <Button 
          onClick={onClose}
          variant="outlined"
          disabled={loadingSimulacao}
          sx={{ borderRadius: '8px', textTransform: 'none' }}
        >
          Cancelar
        </Button>
        
        <Button 
          onClick={handleSimular}
          variant="contained"
          color="primary"
          disabled={!isFormValid || loadingSimulacao}
          startIcon={loadingSimulacao ? <CircularProgress size={20} /> : <Calculate />}
          sx={{ borderRadius: '8px', textTransform: 'none' }}
        >
          {loadingSimulacao ? 'Simulando...' : 'Simular Reajuste'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimulacaoReajusteModal;