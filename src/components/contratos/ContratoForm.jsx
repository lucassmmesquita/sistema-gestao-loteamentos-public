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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete
} from '@mui/material';
import {
  Description as DescriptionIcon,
  AttachMoney as MoneyIcon,
  CalendarMonth as CalendarIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import ReactInputMask from 'react-input-mask';
import { DatePicker } from '@mui/lab';
import useClientes from '../../hooks/useClientes';
import useContratos from '../../hooks/useContratos';
import useLotes from '../../hooks/useLotes';
import Loading from '../common/Loading';
import ContratoPreview from './ContratoPreview';

// Schema de validação usando Yup
const schema = yup.object().shape({
  clienteId: yup.number()
    .required('Cliente é obrigatório')
    .typeError('Cliente é obrigatório'),
  
  loteId: yup.number()
    .required('Lote é obrigatório')
    .typeError('Lote é obrigatório'),
  
  dataInicio: yup.string()
    .required('Data de início é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido. Use AAAA-MM-DD'),
  
  dataFim: yup.string()
    .required('Data de fim é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido. Use AAAA-MM-DD')
    .test('dataFim', 'Data de fim deve ser posterior à data de início', function(value) {
      const { dataInicio } = this.parent;
      if (!dataInicio || !value) return true;
      return new Date(value) > new Date(dataInicio);
    }),
  
  valorTotal: yup.number()
    .required('Valor total é obrigatório')
    .positive('Valor deve ser positivo')
    .typeError('Valor total é obrigatório'),
  
  valorEntrada: yup.number()
    .required('Valor da entrada é obrigatório')
    .positive('Valor deve ser positivo')
    .test('valorEntrada', 'Entrada não pode ser maior que o valor total', function(value) {
      const { valorTotal } = this.parent;
      if (!valorTotal || !value) return true;
      return value <= valorTotal;
    })
    .typeError('Valor da entrada é obrigatório'),
  
  numeroParcelas: yup.number()
    .required('Número de parcelas é obrigatório')
    .integer('Deve ser um número inteiro')
    .min(1, 'Deve ter pelo menos 1 parcela')
    .max(240, 'Número máximo de parcelas é 240')
    .typeError('Número de parcelas é obrigatório'),
  
  dataVencimento: yup.number()
    .required('Dia de vencimento é obrigatório')
    .integer('Deve ser um número inteiro')
    .min(1, 'Dia entre 1 e 28')
    .max(28, 'Dia entre 1 e 28')
    .typeError('Dia de vencimento é obrigatório'),
  
  clausulas: yup.string()
    .required('Cláusulas contratuais são obrigatórias')
    .min(10, 'Cláusulas contratuais devem ter pelo menos 10 caracteres')
});

// Componente ContratoForm
const ContratoForm = ({ contrato = null }) => {
  const navigate = useNavigate();
  const { clientes, loading: clientesLoading } = useClientes();
  const { createContrato, updateContrato, gerarPreviaContrato } = useContratos();
  const { lotes, loading: lotesLoading, loadLotesDisponiveis } = useLotes();
  
  // Estados
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Inicializa o formulário com react-hook-form
  const { handleSubmit, control, formState: { errors }, setValue, getValues, reset, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      clienteId: '',
      loteId: '',
      dataInicio: '',
      dataFim: '',
      valorTotal: '',
      valorEntrada: '',
      numeroParcelas: 12,
      dataVencimento: 10,
      clausulas: ''
    }
  });
  
  // Valores observados
  const valorTotal = watch('valorTotal');
  const valorEntrada = watch('valorEntrada');
  const numeroParcelas = watch('numeroParcelas');
  
  // Calcula o valor da parcela
  const valorParcela = (valorTotal && valorEntrada && numeroParcelas) 
    ? (valorTotal - valorEntrada) / numeroParcelas 
    : 0;
  
  // Carrega os lotes disponíveis ao montar o componente
  useEffect(() => {
    loadLotesDisponiveis();
  }, [loadLotesDisponiveis]);
  
  // Carrega os dados do contrato quando disponíveis
  useEffect(() => {
    if (contrato) {
      // Preenche o formulário com os dados do contrato
      reset({
        clienteId: contrato.clienteId || '',
        loteId: contrato.loteId || '',
        dataInicio: contrato.dataInicio || '',
        dataFim: contrato.dataFim || '',
        valorTotal: contrato.valorTotal || '',
        valorEntrada: contrato.valorEntrada || '',
        numeroParcelas: contrato.numeroParcelas || 12,
        dataVencimento: contrato.dataVencimento || 10,
        clausulas: contrato.clausulas || ''
      });
    }
  }, [contrato, reset]);
  
  // Manipulador para mostrar prévia do contrato
  const handlePreview = async () => {
    setLoading(true);
    
    try {
      const formData = getValues();
      
      // Garante que os dados são do tipo correto
      const contratoData = {
        ...formData,
        clienteId: Number(formData.clienteId),
        loteId: Number(formData.loteId),
        valorTotal: Number(formData.valorTotal),
        valorEntrada: Number(formData.valorEntrada),
        numeroParcelas: Number(formData.numeroParcelas),
        dataVencimento: Number(formData.dataVencimento)
      };
      
      const previa = await gerarPreviaContrato(contratoData);
      
      if (previa) {
        setPreviewContent(previa);
        setPreviewOpen(true);
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Erro ao gerar prévia do contrato: ' + error.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Manipulador para fechar a prévia
  const handleClosePreview = () => {
    setPreviewOpen(false);
  };
  
  // Manipulador para salvar o contrato
  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      let result; // Declarar result aqui
      // Garante que os dados são do tipo correto
      const contratoData = {
        ...data,
        clienteId: Number(data.clienteId),
        loteId: Number(data.loteId),
        valorTotal: Number(data.valorTotal),
        valorEntrada: Number(data.valorEntrada),
        numeroParcelas: Number(data.numeroParcelas),
        dataVencimento: Number(data.dataVencimento)
      };
      
      // Se for edição, mantém o ID e chama updateContrato
      if (contrato && contrato.id) {
        contratoData.id = contrato.id;
        result = await updateContrato(contrato.id, contratoData);
      } else {
        // Se for criação, define o status como pre_contrato e chama createContrato
        contratoData.status = 'pre_contrato'; // Definindo status padrão
        result = await createContrato(contratoData);
      }
      
      // const result = await saveContrato(contratoData); // Linha antiga removida
      
      if (result) {
        setNotification({
          open: true,
          message: contrato ? 'Contrato atualizado com sucesso!' : 'Contrato cadastrado com sucesso!',
          severity: 'success'
        });
        
        // Aguarda um pouco e navega para a lista
        setTimeout(() => {
          navigate('/contratos');
        }, 2000);
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Erro ao salvar contrato: ' + error.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Função para renderizar o conteúdo do passo atual
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Dados Básicos
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Informações Básicas
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="clienteId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={clientes || []}
                      getOptionLabel={(option) => `${option.nome} - ${option.cpfCnpj}`}
                      value={clientes.find(c => c.id === field.value) || null}
                      onChange={(event, newValue) => {
                        field.onChange(newValue ? newValue.id : null);
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Cliente"
                          fullWidth
                          error={!!errors.clienteId}
                          helperText={errors.clienteId?.message}
                        />
                      )}
                      loading={clientesLoading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="loteId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={lotes || []}
                      getOptionLabel={(option) => `${option.loteamento} - Q ${option.quadra}, L ${option.numero} (${option.area}m²)`}
                      value={lotes.find(l => l.id === field.value) || null}
                      onChange={(event, newValue) => {
                        field.onChange(newValue ? newValue.id : null);
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Lote"
                          fullWidth
                          error={!!errors.loteId}
                          helperText={errors.loteId?.message}
                        />
                      )}
                      loading={lotesLoading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="dataInicio"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Data de Início"
                      type="date"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!errors.dataInicio}
                      helperText={errors.dataInicio?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="dataFim"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Data de Fim"
                      type="date"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!errors.dataFim}
                      helperText={errors.dataFim?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        );
        
      case 1: // Valores e Prazos
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Valores e Prazos
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="valorTotal"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Valor Total (R$)"
                      type="number"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MoneyIcon />
                          </InputAdornment>
                        ),
                      }}
                      error={!!errors.valorTotal}
                      helperText={errors.valorTotal?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="valorEntrada"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Valor da Entrada (R$)"
                      type="number"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MoneyIcon />
                          </InputAdornment>
                        ),
                      }}
                      error={!!errors.valorEntrada}
                      helperText={errors.valorEntrada?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="numeroParcelas"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Número de Parcelas"
                      type="number"
                      fullWidth
                      error={!!errors.numeroParcelas}
                      helperText={errors.numeroParcelas?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="dataVencimento"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Dia de Vencimento (1-28)"
                      type="number"
                      fullWidth
                      error={!!errors.dataVencimento}
                      helperText={errors.dataVencimento?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Resumo do Financiamento
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Valor Total:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        R$ {valorTotal ? valorTotal.toLocaleString('pt-BR') : '0,00'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Valor da Entrada:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        R$ {valorEntrada ? valorEntrada.toLocaleString('pt-BR') : '0,00'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Valor Financiado:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        R$ {(valorTotal && valorEntrada) ? (valorTotal - valorEntrada).toLocaleString('pt-BR') : '0,00'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Número de Parcelas:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {numeroParcelas || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Valor da Parcela:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        R$ {valorParcela ? valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
        
      case 2: // Cláusulas Contratuais
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Cláusulas Contratuais
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="clausulas"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Cláusulas Contratuais"
                      multiline
                      rows={12}
                      fullWidth
                      placeholder="Digite as cláusulas contratuais aqui..."
                      error={!!errors.clausulas}
                      helperText={errors.clausulas?.message}
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
          </Box>
        );
        
      default:
        return 'Passo desconhecido';
    }
  };
  
  return (
    <>
      <Loading open={loading || clientesLoading || lotesLoading} />
      
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {contrato ? 'Editar Contrato' : 'Novo Contrato'}
          </Typography>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>Informações Básicas</Typography>
              <Grid container spacing={3}>
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
                        >
                          {clientes.map((cliente) => (
                            <MenuItem key={cliente.id} value={cliente.id}>
                              {cliente.nome} - {cliente.cpfCnpj}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.clienteId && (
                          <Typography variant="caption" color="error">
                            {errors.clienteId.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="loteId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.loteId}>
                        <InputLabel id="lote-select-label">Lote</InputLabel>
                        <Select
                          {...field}
                          labelId="lote-select-label"
                          label="Lote"
                          value={field.value || ''}
                        >
                          {lotes.map((lote) => (
                            <MenuItem key={lote.id} value={lote.id}>
                              {`${lote.loteamento} - Quadra ${lote.quadra}, Lote ${lote.numero} (${lote.area}m²)`}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.loteId && (
                          <Typography variant="caption" color="error">
                            {errors.loteId.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dataInicio"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Data de Início"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={!!errors.dataInicio}
                        helperText={errors.dataInicio?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dataFim"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Data de Fim"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={!!errors.dataFim}
                        helperText={errors.dataFim?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ my: 4 }} />
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>Valores e Prazos</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="valorTotal"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Valor Total (R$)"
                        type="number"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MoneyIcon />
                            </InputAdornment>
                          ),
                        }}
                        error={!!errors.valorTotal}
                        helperText={errors.valorTotal?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="valorEntrada"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Valor da Entrada (R$)"
                        type="number"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MoneyIcon />
                            </InputAdornment>
                          ),
                        }}
                        error={!!errors.valorEntrada}
                        helperText={errors.valorEntrada?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="numeroParcelas"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Número de Parcelas"
                        type="number"
                        fullWidth
                        error={!!errors.numeroParcelas}
                        helperText={errors.numeroParcelas?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dataVencimento"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Dia de Vencimento (1-28)"
                        type="number"
                        fullWidth
                        error={!!errors.dataVencimento}
                        helperText={errors.dataVencimento?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      Resumo do Financiamento
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          Valor Total:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          R$ {valorTotal ? valorTotal.toLocaleString('pt-BR') : '0,00'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          Valor da Entrada:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          R$ {valorEntrada ? valorEntrada.toLocaleString('pt-BR') : '0,00'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          Valor Financiado:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          R$ {(valorTotal && valorEntrada) ? (valorTotal - valorEntrada).toLocaleString('pt-BR') : '0,00'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          Número de Parcelas:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {numeroParcelas || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          Valor da Parcela:
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          R$ {valorParcela ? valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ my: 4 }} />
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>Cláusulas Contratuais</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="clausulas"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Cláusulas Contratuais"
                        multiline
                        rows={12}
                        fullWidth
                        placeholder="Digite as cláusulas contratuais aqui..."
                        error={!!errors.clausulas}
                        helperText={errors.clausulas?.message}
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
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/contratos')}
                sx={{ ml: 1 }}
              >
                Cancelar
              </Button>

              <Box>
                 <Button
                   variant="outlined"
                   color="primary"
                   onClick={handlePreview}
                   sx={{ mr: 1 }}
                   startIcon={<PreviewIcon />}
                 >
                   Visualizar Contrato
                 </Button>
                 <Button
                   variant="contained"
                   color="primary"
                   type="submit"
                 >
                   Salvar
                 </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
      
      {/* Prévia do Contrato */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Prévia do Contrato</DialogTitle>
        <DialogContent>
          <ContratoPreview conteudo={previewContent} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} color="primary">
            Fechar
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            variant="contained"
          >
            Confirmar e Salvar
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default ContratoForm;