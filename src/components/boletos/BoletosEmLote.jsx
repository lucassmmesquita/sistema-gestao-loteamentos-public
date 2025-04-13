import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Alert,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  FormHelperText,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Description as DescriptionIcon,
  AttachMoney as MoneyIcon,
  CalendarMonth as CalendarIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  DoneAll as DoneAllIcon
} from '@mui/icons-material';
import useBoletos from '../../hooks/useBoletos';
import useClientes from '../../hooks/useClientes';
import useContratos from '../../hooks/useContratos';
import Loading from '../common/Loading';

/**
 * Componente para geração de múltiplos boletos em lote
 */
const BoletosEmLote = () => {
  const navigate = useNavigate();
  const { gerarBoletosEmLote, loading } = useBoletos();
  const { clientes, loading: clientesLoading } = useClientes();
  const { loadContratosByCliente, loadContrato, loading: contratosLoading } = useContratos();
  
  // Estados
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [activeStep, setActiveStep] = useState(0);
  const [clienteId, setClienteId] = useState('');
  const [contratoId, setContratoId] = useState('');
  const [contratos, setContratos] = useState([]);
  const [contratoDados, setContratoDados] = useState(null);
  const [loadingContratos, setLoadingContratos] = useState(false);
  const [loadingContratoDados, setLoadingContratoDados] = useState(false);
  
  // Estado para configuração dos boletos
  const [configBoletos, setConfigBoletos] = useState({
    dataInicio: '',
    quantidadeBoletos: 1,
    valorParcela: '',
    intervaloMeses: 1,
    primeiraParcela: 1,
    descricao: 'Parcela {parcela} - Contrato {contrato}'
  });
  
  // Lista dos boletos a serem gerados
  const [boletos, setBoletos] = useState([]);
  
  // Estados de validação
  const [errors, setErrors] = useState({});
  const [boletosGerados, setBoletosGerados] = useState([]);
  
  // Passos do formulário
  const steps = ['Selecionar Cliente e Contrato', 'Configurar Boletos', 'Revisar e Gerar'];
  
  // Carrega os contratos quando o cliente muda
  useEffect(() => {
    if (clienteId) {
      setLoadingContratos(true);
      setContratos([]);
      setContratoId('');
      setContratoDados(null);
      
      loadContratosByCliente(clienteId)
        .then(listaContratos => {
          setContratos(listaContratos);
          setLoadingContratos(false);
        })
        .catch(() => {
          setLoadingContratos(false);
        });
    }
  }, [clienteId, loadContratosByCliente]);
  
  // Carrega os dados do contrato quando o contrato muda
  useEffect(() => {
    if (contratoId) {
      setLoadingContratoDados(true);
      
      loadContrato(contratoId)
        .then(contrato => {
          if (contrato) {
            setContratoDados(contrato);
            
            // Preenche valor com a parcela do contrato
            const valorParcela = contrato.numeroParcelas
              ? (contrato.valorTotal - contrato.valorEntrada) / contrato.numeroParcelas
              : 0;
            
            setConfigBoletos(prev => ({
              ...prev,
              valorParcela: valorParcela,
              quantidadeBoletos: contrato.numeroParcelas || 1,
              descricao: `Parcela {parcela} - Contrato ${contrato.id}`
            }));
          }
        })
        .finally(() => {
          setLoadingContratoDados(false);
        });
    }
  }, [contratoId, loadContrato]);
  
  // Define a data de início padrão (primeiro dia do próximo mês)
  useEffect(() => {
    const dataAtual = new Date();
    const proximoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 1);
    const dataFormatada = proximoMes.toISOString().split('T')[0];
    
    setConfigBoletos(prev => ({
      ...prev,
      dataInicio: dataFormatada
    }));
  }, []);
  
  // Manipulador para alteração de cliente
  const handleClienteChange = (event) => {
    setClienteId(event.target.value);
  };
  
  // Manipulador para alteração de contrato
  const handleContratoChange = (event) => {
    setContratoId(event.target.value);
  };
  
  // Manipulador para alteração de configuração
  const handleConfigChange = (event) => {
    const { name, value } = event.target;
    setConfigBoletos(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Validação dos dados de configuração
  const validarConfig = () => {
    const novosErros = {};
    
    if (!configBoletos.dataInicio) {
      novosErros.dataInicio = 'Data de início é obrigatória';
    }
    
    if (!configBoletos.quantidadeBoletos || configBoletos.quantidadeBoletos < 1) {
      novosErros.quantidadeBoletos = 'Quantidade de boletos deve ser pelo menos 1';
    }
    
    if (!configBoletos.valorParcela || configBoletos.valorParcela <= 0) {
      novosErros.valorParcela = 'Valor da parcela deve ser positivo';
    }
    
    if (!configBoletos.intervaloMeses || configBoletos.intervaloMeses < 1) {
      novosErros.intervaloMeses = 'Intervalo deve ser pelo menos 1 mês';
    }
    
    if (!configBoletos.primeiraParcela || configBoletos.primeiraParcela < 1) {
      novosErros.primeiraParcela = 'Número da primeira parcela deve ser pelo menos 1';
    }
    
    if (!configBoletos.descricao) {
      novosErros.descricao = 'Descrição é obrigatória';
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };
  
  // Gera a prévia dos boletos
  const gerarPrevia = () => {
    if (!validarConfig()) return;
    
    const cliente = clientes.find(c => c.id === clienteId);
    const boletosPrevia = [];
    
    // Data de início como objeto Date
    const dataInicio = new Date(configBoletos.dataInicio);
    
    // Gera a prévia para cada boleto
    for (let i = 0; i < configBoletos.quantidadeBoletos; i++) {
      // Calcula a data de vencimento
      const dataVencimento = new Date(dataInicio);
      dataVencimento.setMonth(dataVencimento.getMonth() + (i * configBoletos.intervaloMeses));
      
      // Número da parcela
      const numeroParcela = Number(configBoletos.primeiraParcela) + i;
      
      // Substitui os placeholders na descrição
      const descricao = configBoletos.descricao
        .replace('{parcela}', numeroParcela)
        .replace('{contrato}', contratoId);
      
      // Cria o objeto de boleto
      boletosPrevia.push({
        clienteId,
        clienteNome: cliente?.nome || '',
        contratoId,
        valor: configBoletos.valorParcela,
        dataVencimento: dataVencimento.toISOString().split('T')[0],
        numeroParcela,
        descricao
      });
    }
    
    setBoletos(boletosPrevia);
    setActiveStep(2);
  };
  
  // Formata valor como moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Formata data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };
  
  // Manipulador para geração de boletos em lote
  const handleGerarBoletos = async () => {
    try {
      const resultado = await gerarBoletosEmLote(boletos);
      
      if (resultado && resultado.length > 0) {
        setBoletosGerados(resultado);
        
        setNotification({
          open: true,
          message: `${resultado.length} boletos gerados com sucesso!`,
          severity: 'success'
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Erro ao gerar boletos: ' + error.message,
        severity: 'error'
      });
    }
  };
  
  // Manipulador para voltar à lista de boletos
  const handleVoltarLista = () => {
    navigate('/boletos');
  };
  
  // Manipulador para avançar para o próximo passo
  const handleNext = () => {
    if (activeStep === 0) {
      // Valida se cliente e contrato foram selecionados
      if (!clienteId) {
        setErrors(prev => ({ ...prev, clienteId: 'Cliente é obrigatório' }));
        return;
      }
      
      if (!contratoId) {
        setErrors(prev => ({ ...prev, contratoId: 'Contrato é obrigatório' }));
        return;
      }
      
      setErrors({});
      setActiveStep(1);
    } else if (activeStep === 1) {
      gerarPrevia();
    }
  };
  
  // Manipulador para voltar ao passo anterior
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  // Renderiza o conteúdo de acordo com o passo atual
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Selecionar Cliente e Contrato
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.clienteId}>
                <InputLabel id="cliente-select-label">Cliente</InputLabel>
                <Select
                  labelId="cliente-select-label"
                  id="cliente-select"
                  value={clienteId}
                  label="Cliente"
                  onChange={handleClienteChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  }
                >
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nome} - {cliente.cpfCnpj}
                    </MenuItem>
                  ))}
                </Select>
                {errors.clienteId && (
                  <FormHelperText>{errors.clienteId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.contratoId}>
                <InputLabel id="contrato-select-label">Contrato</InputLabel>
                <Select
                  labelId="contrato-select-label"
                  id="contrato-select"
                  value={contratoId}
                  label="Contrato"
                  onChange={handleContratoChange}
                  disabled={loadingContratos || !clienteId}
                  startAdornment={
                    <InputAdornment position="start">
                      {loadingContratos ? <CircularProgress size={20} /> : <DescriptionIcon />}
                    </InputAdornment>
                  }
                >
                  {contratos.map((contrato) => (
                    <MenuItem key={contrato.id} value={contrato.id}>
                      Contrato #{contrato.id} - Lote {contrato.loteNumero || contrato.loteId}
                    </MenuItem>
                  ))}
                </Select>
                {errors.contratoId && (
                  <FormHelperText>{errors.contratoId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {contratoDados && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mt: 2 }} variant="outlined">
                  <Typography variant="subtitle1" gutterBottom>
                    Detalhes do Contrato
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Valor Total:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formatCurrency(contratoDados.valorTotal)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Parcelas:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {contratoDados.numeroParcelas}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Valor por Parcela:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formatCurrency((contratoDados.valorTotal - contratoDados.valorEntrada) / contratoDados.numeroParcelas)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
        );
        
      case 1: // Configurar Boletos
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Data do Primeiro Vencimento"
                type="date"
                name="dataInicio"
                value={configBoletos.dataInicio}
                onChange={handleConfigChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.dataInicio}
                helperText={errors.dataInicio}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Valor da Parcela (R$)"
                type="number"
                name="valorParcela"
                value={configBoletos.valorParcela}
                onChange={handleConfigChange}
                fullWidth
                error={!!errors.valorParcela}
                helperText={errors.valorParcela}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Número de Boletos"
                type="number"
                name="quantidadeBoletos"
                value={configBoletos.quantidadeBoletos}
                onChange={handleConfigChange}
                fullWidth
                error={!!errors.quantidadeBoletos}
                helperText={errors.quantidadeBoletos}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Intervalo entre Boletos (meses)"
                type="number"
                name="intervaloMeses"
                value={configBoletos.intervaloMeses}
                onChange={handleConfigChange}
                fullWidth
                error={!!errors.intervaloMeses}
                helperText={errors.intervaloMeses}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Número da Primeira Parcela"
                type="number"
                name="primeiraParcela"
                value={configBoletos.primeiraParcela}
                onChange={handleConfigChange}
                fullWidth
                error={!!errors.primeiraParcela}
                helperText={errors.primeiraParcela}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Descrição do Boleto"
                name="descricao"
                value={configBoletos.descricao}
                onChange={handleConfigChange}
                fullWidth
                error={!!errors.descricao}
                helperText={errors.descricao || "Use {parcela} para número da parcela e {contrato} para número do contrato"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Exemplo de boleto gerado com estas configurações:
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Valor:</strong> {formatCurrency(configBoletos.valorParcela)}
                </Typography>
                <Typography variant="body1">
                  <strong>Vencimento:</strong> {formatDate(configBoletos.dataInicio)}
                </Typography>
                <Typography variant="body1">
                  <strong>Descrição:</strong> {configBoletos.descricao
                    .replace('{parcela}', configBoletos.primeiraParcela)
                    .replace('{contrato}', contratoId)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        );
        
      case 2: // Revisar e Gerar
        return (
          <>
            {boletosGerados.length > 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <DoneAllIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Boletos Gerados com Sucesso!
                </Typography>
                <Typography variant="body1" paragraph>
                  Foram gerados {boletosGerados.length} boletos para o cliente.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleVoltarLista}
                  sx={{ mt: 2 }}
                >
                  Ver Lista de Boletos
                </Button>
              </Box>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Boletos a serem gerados: {boletos.length}
                </Typography>
                
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Parcela</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Vencimento</TableCell>
                        <TableCell align="right">Valor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {boletos.map((boleto, index) => (
                        <TableRow key={index}>
                          <TableCell>{boleto.numeroParcela}</TableCell>
                          <TableCell>{boleto.descricao}</TableCell>
                          <TableCell>{formatDate(boleto.dataVencimento)}</TableCell>
                          <TableCell align="right">{formatCurrency(boleto.valor)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Valor total: {formatCurrency(boletos.reduce((total, boleto) => total + Number(boleto.valor), 0))}
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGerarBoletos}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                >
                  Gerar Boletos
                </Button>
              </>
            )}
          </>
        );
        
      default:
        return 'Passo desconhecido';
    }
  };
  
  return (
    <>
      <Loading open={loading || clientesLoading || contratosLoading || loadingContratoDados} />
      
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Gerar Boletos em Lote
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {getStepContent(activeStep)}
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={activeStep === 0 ? handleVoltarLista : handleBack}
              variant="outlined"
              disabled={loading}
            >
              {activeStep === 0 ? 'Cancelar' : 'Voltar'}
            </Button>
            
            {activeStep < 2 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={loading || (activeStep === 0 && (!clienteId || !contratoId))}
              >
                {activeStep === 1 ? 'Revisar Boletos' : 'Próximo'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
      
      {/* Notificação */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BoletosEmLote;