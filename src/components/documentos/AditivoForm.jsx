// src/components/documentos/AditivoForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Grid,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Description as DescriptionIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/lab';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useContratos from '../../hooks/useContratos';
import useDocumentosContratuais from '../../hooks/useDocumentosContratuais';
import FileUpload from '../common/FileUpload';
import Loading from '../common/Loading';

// Schema de validação
const schema = yup.object().shape({
  tipo: yup.string().required('Tipo de aditivo é obrigatório'),
  dataEmissao: yup.string().required('Data de emissão é obrigatória'),
  dataValidade: yup.string().required('Data de validade é obrigatória'),
  valorOriginal: yup.number().required('Valor original é obrigatório').positive('Valor deve ser positivo'),
  valorNovo: yup.number().required('Novo valor é obrigatório').positive('Valor deve ser positivo'),
  descricao: yup.string().required('Descrição é obrigatória').min(10, 'Descrição deve ter pelo menos 10 caracteres')
});

const AditivoForm = ({ aditivo }) => {
  const navigate = useNavigate();
  const { contratoId, aditivoId } = useParams();
  const { loadContrato, currentContrato } = useContratos();
  const { saveAditivo, loading } = useDocumentosContratuais();
  
  // Estados
  const [activeStep, setActiveStep] = useState(0);
  const [documentos, setDocumentos] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Definição das etapas
  const steps = ['Informações Básicas', 'Valores', 'Documentos'];
  
  // Configuração do formulário
  const { handleSubmit, control, setValue, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tipo: '',
      dataEmissao: new Date().toISOString().split('T')[0],
      dataValidade: '',
      valorOriginal: '',
      valorNovo: '',
      descricao: ''
    }
  });
  
  // Carregar dados do contrato e aditivo (se existir)
  useEffect(() => {
    const loadData = async () => {
      if (contratoId) {
        const contrato = await loadContrato(parseInt(contratoId));
        if (contrato) {
          setValue('valorOriginal', contrato.valorTotal);
        }
      }
    };
    
    loadData();
    
    // Se for edição, carregar dados do aditivo
    if (aditivo) {
      reset({
        tipo: aditivo.tipo,
        dataEmissao: aditivo.dataEmissao,
        dataValidade: aditivo.dataValidade,
        valorOriginal: aditivo.valorOriginal,
        valorNovo: aditivo.valorNovo,
        descricao: aditivo.descricao
      });
      
      if (aditivo.documentoUrl) {
        // Aqui teríamos que buscar o documento no backend
        // Como é apenas simulação, vamos deixar vazio
      }
    }
  }, [contratoId, aditivo, loadContrato, setValue, reset]);
  
  // Manipuladores
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleCancel = () => {
    navigate(`/contratos/${contratoId}`);
  };
  
  const onSubmit = async (data) => {
    try {
      const aditivoData = {
        ...data,
        contratoId: parseInt(contratoId)
      };
      
      if (aditivo && aditivo.id) {
        aditivoData.id = aditivo.id;
      }
      
      // Adicionar documento se houver
      if (documentos.length > 0) {
        // Em um caso real, aqui enviaríamos o arquivo para o servidor
        // e receberíamos a URL do documento
        aditivoData.documentoUrl = URL.createObjectURL(documentos[0]);
      }
      
      // Salvar aditivo
      const result = await saveAditivo(aditivoData);
      
      if (result) {
        setNotification({
          open: true,
          message: aditivo ? 'Aditivo atualizado com sucesso!' : 'Aditivo cadastrado com sucesso!',
          severity: 'success'
        });
        
        // Aguardar um pouco e redirecionar
        setTimeout(() => {
          navigate(`/contratos/${contratoId}`);
        }, 2000);
      }
    } catch (error) {
      setNotification({
        open: true,
        message: `Erro ao salvar aditivo: ${error.message}`,
        severity: 'error'
      });
    }
  };
  
  // Conteúdo de cada etapa
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Informações Básicas
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.tipo}>
                    <InputLabel id="tipo-select-label">Tipo de Aditivo</InputLabel>
                    <Select
                      {...field}
                      labelId="tipo-select-label"
                      label="Tipo de Aditivo"
                    >
                      <MenuItem value="RENEGOCIACAO">Renegociação</MenuItem>
                      <MenuItem value="ANTECIPACAO">Antecipação</MenuItem>
                      <MenuItem value="EXTENSAO_PRAZO">Extensão de Prazo</MenuItem>
                    </Select>
                    {errors.tipo && (
                      <Typography variant="caption" color="error">
                        {errors.tipo.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="dataEmissao"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Data de Emissão"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.dataEmissao}
                    helperText={errors.dataEmissao?.message}
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
                name="dataValidade"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Data de Validade"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.dataValidade}
                    helperText={errors.dataValidade?.message}
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
            
            <Grid item xs={12}>
              <Controller
                name="descricao"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descrição"
                    multiline
                    rows={4}
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
        );
      
      case 1: // Valores
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="valorOriginal"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Valor Original"
                    type="number"
                    fullWidth
                    disabled={currentContrato}
                    error={!!errors.valorOriginal}
                    helperText={errors.valorOriginal?.message}
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
            
            <Grid item xs={12} md={6}>
              <Controller
                name="valorNovo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Novo Valor"
                    type="number"
                    fullWidth
                    error={!!errors.valorNovo}
                    helperText={errors.valorNovo?.message}
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
          </Grid>
        );
      
      case 2: // Documentos
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Documento do Aditivo
            </Typography>
            
            <FileUpload
              label="Anexar documento do aditivo"
              value={documentos}
              onChange={setDocumentos}
              maxFiles={1}
              acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
            />
          </Box>
        );
      
      default:
        return 'Etapa desconhecida';
    }
  };
  
  return (
    <Box>
      <Loading open={loading} />
      
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {aditivo ? 'Editar Aditivo' : 'Novo Aditivo'}
        </Typography>
        
        {currentContrato && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1">
              Contrato #{currentContrato.id}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Valor: R$ {currentContrato.valorTotal.toLocaleString('pt-BR')}
            </Typography>
          </Box>
        )}
        
        <Divider sx={{ mb: 3 }} />
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 4 }}>
            {getStepContent(activeStep)}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={activeStep === 0 ? handleCancel : handleBack}
            >
              {activeStep === 0 ? 'Cancelar' : 'Voltar'}
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={<SaveIcon />}
              >
                Salvar
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Próximo
              </Button>
            )}
          </Box>
        </form>
      </Paper>
      
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
    </Box>
  );
};

export default AditivoForm;