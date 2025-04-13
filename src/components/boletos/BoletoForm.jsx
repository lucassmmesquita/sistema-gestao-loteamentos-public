import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  Typography,
  Divider,
  InputAdornment,
  Snackbar,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  CalendarMonth as CalendarIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Add as AddIcon
} from '@mui/icons-material';
import useBoletos from '../../hooks/useBoletos';
import useClientes from '../../hooks/useClientes';
import useContratos from '../../hooks/useContratos';
import Loading from '../common/Loading';

// Schema de validação usando Yup
const schema = yup.object().shape({
  clienteId: yup.number()
    .required('Cliente é obrigatório')
    .typeError('Cliente é obrigatório'),
  
  contratoId: yup.number()
    .required('Contrato é obrigatório')
    .typeError('Contrato é obrigatório'),
  
  valor: yup.number()
    .required('Valor é obrigatório')
    .positive('Valor deve ser positivo')
    .typeError('Valor é obrigatório'),
  
  dataVencimento: yup.string()
    .required('Data de vencimento é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido. Use AAAA-MM-DD'),
  
  numeroParcela: yup.number()
    .required('Número da parcela é obrigatório')
    .integer('Deve ser um número inteiro')
    .min(1, 'Deve ser no mínimo 1')
    .typeError('Número da parcela é obrigatório'),
  
  descricao: yup.string()
    .required('Descrição é obrigatória')
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
});

/**
 * Componente para geração de boleto individual
 */
const BoletoForm = ({ contratoInicial = null }) => {
  const navigate = useNavigate();
  const { gerarBoleto, loading, error } = useBoletos();
  const { clientes, loading: clientesLoading } = useClientes();
  const { loadContratosByCliente, loadContrato, loading: contratosLoading } = useContratos();
  
  // Estados
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [contratos, setContratos] = useState([]);
  const [loadingContratos, setLoadingContratos] = useState(false);
  const [contratoDados, setContratoDados] = useState(null);
  const [loadingContratoDados, setLoadingContratoDados] = useState(false);
  const [submitting, setSubmitting] = useState(false); // Novo estado para controlar o submit
  
  // Inicializa o formulário com react-hook-form
  const { handleSubmit, control, formState: { errors }, setValue, getValues, reset, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      clienteId: '',
      contratoId: '',
      valor: '',
      dataVencimento: '',
      numeroParcela: 1,
      descricao: ''
    }
  });
  
  const clienteId = watch('clienteId');
  const contratoId = watch('contratoId');
  
  // Se um contrato inicial for fornecido, carrega seus dados
  useEffect(() => {
    if (contratoInicial) {
      setLoadingContratoDados(true);
      
      loadContrato(contratoInicial)
        .then(contrato => {
          if (contrato) {
            setValue('clienteId', contrato.clienteId);
            setValue('contratoId', contrato.id);
            
            // Carrega os contratos do cliente para preencher o dropdown
            setLoadingContratos(true);
            loadContratosByCliente(contrato.clienteId)
              .then(listaContratos => {
                setContratos(listaContratos);
                setLoadingContratos(false);
              })
              .catch(() => {
                setLoadingContratos(false);
              });
            
            setContratoDados(contrato);
          }
        })
        .finally(() => {
          setLoadingContratoDados(false);
        });
    }
  }, [contratoInicial, loadContrato, setValue, loadContratosByCliente]);
  
  // Carrega os contratos quando o cliente muda
  useEffect(() => {
    if (clienteId) {
      setLoadingContratos(true);
      setContratos([]);
      setValue('contratoId', '');
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
  }, [clienteId, loadContratosByCliente, setValue]);
  
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
            
            setValue('valor', valorParcela);
            setValue('descricao', `Parcela ${watch('numeroParcela')} - Contrato ${contrato.id}`);
          }
        })
        .finally(() => {
          setLoadingContratoDados(false);
        });
    }
  }, [contratoId, loadContrato, setValue, watch]);
  
  // Atualiza a descrição quando o número da parcela muda
  useEffect(() => {
    if (contratoDados) {
      const numeroParcela = watch('numeroParcela');
      setValue('descricao', `Parcela ${numeroParcela} - Contrato ${contratoDados.id}`);
    }
  }, [watch('numeroParcela'), contratoDados, setValue, watch]);
  
  // Manipulador para gerar boleto
  const onSubmit = async (data) => {
    console.log("Formulário submetido:", data); // Log para depuração
    setSubmitting(true); // Indica que está submetendo o formulário
    
    try {
      // Cliente selecionado (para obter o nome)
      const cliente = clientes.find(c => c.id === Number(data.clienteId));
      
      // Adiciona o nome do cliente aos dados e converte tipos
      const boletoData = {
        ...data,
        clienteId: Number(data.clienteId),
        contratoId: Number(data.contratoId),
        valor: Number(data.valor),
        numeroParcela: Number(data.numeroParcela),
        clienteNome: cliente?.nome || '',
      };
      
      console.log("Dados do boleto a ser gerado:", boletoData); // Log para depuração
      
      const resultado = await gerarBoleto(boletoData);
      
      console.log("Resultado da geração:", resultado); // Log para depuração
      
      if (resultado) {
        setNotification({
          open: true,
          message: 'Boleto gerado com sucesso!',
          severity: 'success'
        });
        
        // Aguarda um pouco e navega para a lista ou detalhes
        setTimeout(() => {
          navigate(`/boletos/${resultado.id}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao gerar boleto:", error); // Log para depuração
      setNotification({
        open: true,
        message: 'Erro ao gerar boleto: ' + (error.message || 'Erro desconhecido'),
        severity: 'error'
      });
    } finally {
      setSubmitting(false); // Finaliza o estado de submissão
    }
  };
  
  // Define a data de vencimento padrão (hoje + 30 dias)
  useEffect(() => {
    const dataAtual = new Date();
    dataAtual.setDate(dataAtual.getDate() + 30);
    const dataFormatada = dataAtual.toISOString().split('T')[0];
    
    setValue('dataVencimento', dataFormatada);
  }, [setValue]);
  
  return (
    <>
      <Loading open={loading || clientesLoading || contratosLoading || loadingContratoDados || submitting} />
      
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Gerar Boleto
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Cliente */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="clienteId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.clienteId}>
                      <InputLabel id="cliente-select-label">Cliente</InputLabel>
                      <Select
                        {...field}
                        labelId="cliente-select-label"
                        label="Cliente"
                        value={field.value || ''}
                        disabled={!!contratoInicial}
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
                        <FormHelperText>{errors.clienteId.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              
              {/* Contrato */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="contratoId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.contratoId}>
                      <InputLabel id="contrato-select-label">Contrato</InputLabel>
                      <Select
                        {...field}
                        labelId="contrato-select-label"
                        label="Contrato"
                        value={field.value || ''}
                        disabled={loadingContratos || !clienteId || !!contratoInicial}
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
                        <FormHelperText>{errors.contratoId.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              
              {/* Número da Parcela */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="numeroParcela"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Número da Parcela"
                      type="number"
                      fullWidth
                      error={!!errors.numeroParcela}
                      helperText={errors.numeroParcela?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AddIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              
              {/* Valor */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="valor"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Valor (R$)"
                      type="number"
                      fullWidth
                      error={!!errors.valor}
                      helperText={errors.valor?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MoneyIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              
              {/* Data de Vencimento */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="dataVencimento"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Data de Vencimento"
                      type="date"
                      fullWidth
                      error={!!errors.dataVencimento}
                      helperText={errors.dataVencimento?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon />
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </Grid>
              
              {/* Descrição */}
              <Grid item xs={12}>
                <Controller
                  name="descricao"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Descrição do Boleto"
                      fullWidth
                      error={!!errors.descricao}
                      helperText={errors.descricao?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            
            {/* Informações do contrato */}
            {contratoDados && (
              <Box mt={4} p={2} bgcolor="background.paper" borderRadius={1}>
                <Typography variant="subtitle1" gutterBottom>
                  Detalhes do Contrato
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      Valor Total:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      R$ {contratoDados.valorTotal?.toLocaleString('pt-BR') || '0,00'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      Parcelas:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {contratoDados.numeroParcelas || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="textSecondary">
                      Valor da Parcela:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      R$ {contratoDados.numeroParcelas
                        ? ((contratoDados.valorTotal - contratoDados.valorEntrada) / contratoDados.numeroParcelas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                        : '0,00'
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/boletos')}
                sx={{ mr: 2 }}
                disabled={submitting}
              >
                Cancelar
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={submitting || !clienteId || !contratoId}
              >
                {submitting ? 'Gerando...' : 'Gerar Boleto'}
              </Button>
            </Box>
          </form>
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

export default BoletoForm;