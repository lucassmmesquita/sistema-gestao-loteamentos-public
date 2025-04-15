// src/components/documentos/DistratoForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
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
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useContratos from '../../hooks/useContratos';
import useDocumentosContratuais from '../../hooks/useDocumentosContratuais';
import FileUpload from '../common/FileUpload';
import Loading from '../common/Loading';

// Schema de validação
const schema = yup.object().shape({
  dataEmissao: yup.string().required('Data de emissão é obrigatória'),
  motivo: yup.string().required('Motivo é obrigatório').min(10, 'Motivo deve ter pelo menos 10 caracteres'),
  valorDevolucao: yup.number().required('Valor de devolução é obrigatório').min(0, 'Valor não pode ser negativo'),
  penalidades: yup.string().required('Penalidades é obrigatório').min(10, 'Penalidades deve ter pelo menos 10 caracteres')
});

const DistratoForm = ({ distrato }) => {
  const navigate = useNavigate();
  const { contratoId, distratoId } = useParams();
  const { loadContrato, currentContrato } = useContratos();
  const { saveDistrato, loading } = useDocumentosContratuais();
  
  // Estados
  const [activeStep, setActiveStep] = useState(0);
  const [documentos, setDocumentos] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Definição das etapas
  const steps = ['Informações Básicas', 'Documentos'];
  
  // Configuração do formulário
  const { handleSubmit, control, setValue, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      dataEmissao: new Date().toISOString().split('T')[0],
      motivo: '',
      valorDevolucao: '',
      penalidades: ''
    }
  });
  
  // Carregar dados do contrato e distrato (se existir)
  useEffect(() => {
    const loadData = async () => {
      if (contratoId) {
        await loadContrato(parseInt(contratoId));
      }
    };
    
    loadData();
    
    // Se for edição, carregar dados do distrato
    if (distrato) {
      reset({
        dataEmissao: distrato.dataEmissao,
        motivo: distrato.motivo,
        valorDevolucao: distrato.valorDevolucao,
        penalidades: distrato.penalidades
      });
      
      if (distrato.documentoUrl) {
        // Aqui teríamos que buscar o documento no backend
        // Como é apenas simulação, vamos deixar vazio
      }
    }
  }, [contratoId, distrato, loadContrato, setValue, reset]);
  
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
      const distratoData = {
        ...data,
        contratoId: parseInt(contratoId),
        status: 'PENDENTE'
      };
      
      if (distrato && distrato.id) {
        distratoData.id = distrato.id;
      }
      
      // Adicionar documento se houver
      if (documentos.length > 0) {
        // Em um caso real, aqui enviaríamos o arquivo para o servidor
        // e receberíamos a URL do documento
        distratoData.documentoUrl = URL.createObjectURL(documentos[0]);
      }
      
      // Salvar distrato
      const result = await saveDistrato(distratoData);
      
      if (result) {
        setNotification({
          open: true,
          message: distrato ? 'Distrato atualizado com sucesso!' : 'Distrato cadastrado com sucesso!',
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
        message: `Erro ao salvar distrato: ${error.message}`,
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
                name="valorDevolucao"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Valor de Devolução"
                    type="number"
                    fullWidth
                    error={!!errors.valorDevolucao}
                    helperText={errors.valorDevolucao?.message}
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
            
            <Grid item xs={12}>
              <Controller
                name="motivo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Motivo do Distrato"
                    multiline
                    rows={4}
                    fullWidth
                    error={!!errors.motivo}
                    helperText={errors.motivo?.message}
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
            
            <Grid item xs={12}>
              <Controller
                name="penalidades"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Penalidades"
                    multiline
                    rows={4}
                    fullWidth
                    error={!!errors.penalidades}
                    helperText={errors.penalidades?.message}
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
      
      case 1: // Documentos
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Documento do Distrato
            </Typography>
            
            <FileUpload
              label="Anexar documento do distrato"
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
          {distrato ? 'Editar Distrato' : 'Novo Distrato'}
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

export default DistratoForm;