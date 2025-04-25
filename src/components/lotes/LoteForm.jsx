// src/components/lotes/LoteForm.jsx

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
  MenuItem
} from '@mui/material';
import {
  Landscape as LandscapeIcon,
  GridOn as GridOnIcon,
  FormatShapes as FormatShapesIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import useLotes from '../../hooks/useLotes';
import Loading from '../common/Loading';

// Schema de validação usando Yup
const schema = yup.object().shape({
  quadra: yup.number()
    .required('Quadra é obrigatória')
    .typeError('Quadra deve ser um número'),
  
  numero: yup.number()
    .required('Número do lote é obrigatório')
    .typeError('Número do lote deve ser um número'),
  
  loteamento: yup.string()
    .required('Loteamento é obrigatório')
    .max(100, 'Loteamento deve ter no máximo 100 caracteres'),
  
  area: yup.number()
    .required('Área é obrigatória')
    .positive('Área deve ser positiva')
    .typeError('Área deve ser um número'),
  
  chave: yup.string()
    .required('Chave é obrigatória')
    .max(50, 'Chave deve ter no máximo 50 caracteres'),
  
  status: yup.string()
    .required('Status é obrigatório')
    .oneOf(['disponivel', 'reservado', 'vendido'], 'Status inválido')
});

// Componente LoteForm
const LoteForm = ({ lote = null }) => {
  const navigate = useNavigate();
  const { saveLote, loading, error: apiError } = useLotes();
  
  // Estados
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Inicializa o formulário com react-hook-form
  const { handleSubmit, control, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      quadra: '',
      numero: '',
      loteamento: '',
      area: '',
      chave: '',
      status: 'disponivel'
    }
  });
  
  // Carrega os dados do lote quando disponíveis
  useEffect(() => {
    if (lote) {
      console.log('Carregando dados do lote:', lote);
      
      // Preenche o formulário com os dados do lote
      reset({
        quadra: lote.quadra || '',
        numero: lote.numero || '',
        loteamento: lote.loteamento || '',
        area: lote.area || '',
        chave: lote.chave || '',
        status: lote.status || 'disponivel'
      });
    }
  }, [lote, reset]);
  
  // Manipulador para salvar o lote
  const onSubmit = async (data) => {
    console.log('Formulário submetido com dados:', data);
    setSubmitting(true);
    
    // Se for edição, mantém o ID
    const loteData = {
      ...data
    };
    
    if (lote && lote.id) {
      loteData.id = lote.id;
    }
    
    try {
      console.log('Enviando dados para o backend:', loteData);
      const result = await saveLote(loteData);
      
      console.log('Resposta do backend:', result);
      
      if (result) {
        setNotification({
          open: true,
          message: lote ? 'Lote atualizado com sucesso!' : 'Lote cadastrado com sucesso!',
          severity: 'success'
        });
        
        // Aguarda um pouco e navega para a lista
        setTimeout(() => {
          navigate('/lotes');
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao salvar lote:', error);
      
      setNotification({
        open: true,
        message: 'Erro ao salvar lote: ' + (error.message || 'Erro desconhecido'),
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <>
      <Loading open={loading || submitting} />
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/lotes')}
              sx={{ mr: 2 }}
            >
              Voltar
            </Button>
            <Typography variant="h5" component="h2">
              {lote ? 'Editar Lote' : 'Novo Lote'}
            </Typography>
          </Box>
          
          {/* Exibir erros da API se houver */}
          {apiError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {apiError}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Paper sx={{ p: 3, mb: 4 }}>
              {/* Seção de Dados Básicos */}
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Informações do Lote
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="loteamento"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Loteamento"
                        fullWidth
                        error={!!errors.loteamento}
                        helperText={errors.loteamento?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LandscapeIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller
                    name="quadra"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Quadra"
                        type="number"
                        fullWidth
                        error={!!errors.quadra}
                        helperText={errors.quadra?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <GridOnIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller
                    name="numero"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Número do Lote"
                        type="number"
                        fullWidth
                        error={!!errors.numero}
                        helperText={errors.numero?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="area"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Área (m²)"
                        type="number"
                        fullWidth
                        error={!!errors.area}
                        helperText={errors.area?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FormatShapesIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="chave"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Chave"
                        fullWidth
                        error={!!errors.chave}
                        helperText={errors.chave?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.status}>
                        <InputLabel id="status-select-label">Status</InputLabel>
                        <Select
                          {...field}
                          labelId="status-select-label"
                          label="Status"
                          value={field.value || 'disponivel'}
                        >
                          <MenuItem value="disponivel">Disponível</MenuItem>
                          <MenuItem value="reservado">Reservado</MenuItem>
                          <MenuItem value="vendido">Vendido</MenuItem>
                        </Select>
                        {errors.status && (
                          <Typography variant="caption" color="error">
                            {errors.status.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>
            
            {/* Botões de Ação */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/lotes')}
                disabled={submitting}
              >
                Cancelar
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={submitting}
                startIcon={<SaveIcon />}
              >
                {submitting ? 'Salvando...' : 'Salvar'}
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

export default LoteForm;