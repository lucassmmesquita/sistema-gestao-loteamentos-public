// src/components/documentos/QuitacaoForm.jsx
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
  Alert,
  Snackbar
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
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
  valorTotal: yup.number().required('Valor total é obrigatório').positive('Valor deve ser positivo'),
  metodoPagamento: yup.string().required('Método de pagamento é obrigatório')
});

const QuitacaoForm = ({ quitacao }) => {
  const navigate = useNavigate();
  const { contratoId, quitacaoId } = useParams();
  const { loadContrato, currentContrato } = useContratos();
  const { saveQuitacao, loading } = useDocumentosContratuais();
  
  // Estados
  const [documentos, setDocumentos] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Configuração do formulário
  const { handleSubmit, control, setValue, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      dataEmissao: new Date().toISOString().split('T')[0],
      valorTotal: '',
      metodoPagamento: ''
    }
  });
  
  // Carregar dados do contrato e quitação (se existir)
  useEffect(() => {
    const loadData = async () => {
      if (contratoId) {
        const contrato = await loadContrato(parseInt(contratoId));
        if (contrato) {
          setValue('valorTotal', contrato.valorTotal);
        }
      }
    };
    
    loadData();
    
    // Se for edição, carregar dados da quitação
    if (quitacao) {
      reset({
        dataEmissao: quitacao.dataEmissao,
        valorTotal: quitacao.valorTotal,
        metodoPagamento: quitacao.metodoPagamento
      });
      
      if (quitacao.documentoUrl) {
        // Aqui teríamos que buscar o documento no backend
        // Como é apenas simulação, vamos deixar vazio
      }
    }
  }, [contratoId, quitacao, loadContrato, setValue, reset]);
  
  // Manipuladores
  const handleCancel = () => {
    navigate(`/contratos/${contratoId}`);
  };
  
  const onSubmit = async (data) => {
    try {
      const quitacaoData = {
        ...data,
        contratoId: parseInt(contratoId)
      };
      
      if (quitacao && quitacao.id) {
        quitacaoData.id = quitacao.id;
      }
      
      // Adicionar documento se houver
      if (documentos.length > 0) {
        // Em um caso real, aqui enviaríamos o arquivo para o servidor
        // e receberíamos a URL do documento
        quitacaoData.documentoUrl = URL.createObjectURL(documentos[0]);
      }
      
      // Salvar quitação
      const result = await saveQuitacao(quitacaoData);
      
      if (result) {
        setNotification({
          open: true,
          message: quitacao ? 'Quitação atualizada com sucesso!' : 'Quitação cadastrada com sucesso!',
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
        message: `Erro ao salvar quitação: ${error.message}`,
        severity: 'error'
      });
    }
  };
  
  return (
    <Box>
      <Loading open={loading} />
      
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {quitacao ? 'Editar Quitação' : 'Nova Quitação'}
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
        
        <form onSubmit={handleSubmit(onSubmit)}>
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
                name="valorTotal"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Valor Total"
                    type="number"
                    fullWidth
                    disabled={currentContrato}
                    error={!!errors.valorTotal}
                    helperText={errors.valorTotal?.message}
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
                name="metodoPagamento"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.metodoPagamento}>
                    <InputLabel id="metodo-pagamento-label">Método de Pagamento</InputLabel>
                    <Select
                      {...field}
                      labelId="metodo-pagamento-label"
                      label="Método de Pagamento"
                    >
                      <MenuItem value="PIX">PIX</MenuItem>
                      <MenuItem value="TRANSFERENCIA">Transferência Bancária</MenuItem>
                      <MenuItem value="BOLETO">Boleto</MenuItem>
                      <MenuItem value="CHEQUE">Cheque</MenuItem>
                      <MenuItem value="DINHEIRO">Dinheiro</MenuItem>
                    </Select>
                    {errors.metodoPagamento && (
                      <Typography variant="caption" color="error">
                        {errors.metodoPagamento.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Documento de Quitação
                </Typography>
                
                <FileUpload
                  label="Anexar documento de quitação"
                  value={documentos}
                  onChange={setDocumentos}
                  maxFiles={1}
                  acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
                />
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<SaveIcon />}
            >
              Salvar
            </Button>
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

export default QuitacaoForm;