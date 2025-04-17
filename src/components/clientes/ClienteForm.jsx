// src/components/clientes/ClienteForm.jsx
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
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import ReactInputMask from 'react-input-mask';
import useClientes from '../../hooks/useClientes';
import { validarCPFouCNPJ, validarEmail, validarCEP } from '../../utils/validators';
import DocumentosUpload from './DocumentosUpload';
import Loading from '../common/Loading';

// Schema de validação usando Yup
const schema = yup.object().shape({
  nome: yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  cpfCnpj: yup.string()
    .required('CPF/CNPJ é obrigatório')
    .test('cpf-cnpj-valido', 'CPF/CNPJ inválido', validarCPFouCNPJ),
  
  dataNascimento: yup.string()
    .required('Data de nascimento é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido. Use AAAA-MM-DD'),
  
  endereco: yup.object().shape({
    cep: yup.string()
      .required('CEP é obrigatório')
      .test('cep-valido', 'CEP inválido', validarCEP),
    
    logradouro: yup.string()
      .required('Logradouro é obrigatório')
      .max(100, 'Logradouro deve ter no máximo 100 caracteres'),
    
    numero: yup.string()
      .required('Número é obrigatório')
      .max(10, 'Número deve ter no máximo 10 caracteres'),
    
    complemento: yup.string()
      .nullable()
      .max(50, 'Complemento deve ter no máximo 50 caracteres'),
    
    bairro: yup.string()
      .required('Bairro é obrigatório')
      .max(50, 'Bairro deve ter no máximo 50 caracteres'),
    
    cidade: yup.string()
      .required('Cidade é obrigatória')
      .max(50, 'Cidade deve ter no máximo 50 caracteres'),
    
    estado: yup.string()
      .required('Estado é obrigatório')
      .length(2, 'Use a sigla do estado (2 caracteres)')
  }),
  
  contatos: yup.object().shape({
    telefones: yup.array()
      .of(yup.string().required('Telefone é obrigatório'))
      .min(1, 'Informe pelo menos um telefone'),
    
    emails: yup.array()
      .of(
        yup.string()
          .required('E-mail é obrigatório')
          .test('email-valido', 'E-mail inválido', validarEmail)
      )
      .min(1, 'Informe pelo menos um e-mail')
  })
});

// Componente ClienteForm
const ClienteForm = ({ cliente = null }) => {
  const navigate = useNavigate();
  const { saveCliente, loading, error: apiError } = useClientes();
  
  // Estados
  const [documentos, setDocumentos] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Inicializa o formulário com react-hook-form
  const { handleSubmit, control, formState: { errors }, setValue, getValues, reset, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nome: '',
      cpfCnpj: '',
      dataNascimento: '',
      endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
      },
      contatos: {
        telefones: [''],
        emails: ['']
      }
    }
  });
  
  // Observa o CEP para buscar dados de endereço
  const cep = watch('endereco.cep');
  
  // Busca dados de endereço pelo CEP
  useEffect(() => {
    const buscaCep = async () => {
      if (cep && cep.replace(/[^0-9]/g, '').length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep.replace(/[^0-9]/g, '')}/json/`);
          const data = await response.json();
          
          if (data && !data.erro) {
            setValue('endereco.logradouro', data.logradouro);
            setValue('endereco.bairro', data.bairro);
            setValue('endereco.cidade', data.localidade);
            setValue('endereco.estado', data.uf);
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
        }
      }
    };
    
    buscaCep();
  }, [cep, setValue]);
  
  // Carrega os dados do cliente quando disponíveis
  useEffect(() => {
    if (cliente) {
      console.log('Carregando dados do cliente:', cliente);
      
      // Preenche o formulário com os dados do cliente
      reset({
        nome: cliente.nome || '',
        cpfCnpj: cliente.cpfCnpj || '',
        dataNascimento: cliente.dataNascimento || '',
        endereco: {
          cep: cliente.endereco?.cep || '',
          logradouro: cliente.endereco?.logradouro || '',
          numero: cliente.endereco?.numero || '',
          complemento: cliente.endereco?.complemento || '',
          bairro: cliente.endereco?.bairro || '',
          cidade: cliente.endereco?.cidade || '',
          estado: cliente.endereco?.estado || ''
        },
        contatos: {
          telefones: cliente.contatos?.telefones?.length ? cliente.contatos.telefones : [''],
          emails: cliente.contatos?.emails?.length ? cliente.contatos.emails : ['']
        }
      });
      
      // Define os documentos se existirem
      if (cliente.documentos && cliente.documentos.length > 0) {
        setDocumentos(cliente.documentos);
      }
    }
  }, [cliente, reset]);
  
  // Manipuladores para adicionar/remover campos dinâmicos
  const addTelefone = () => {
    const telefones = getValues('contatos.telefones');
    setValue('contatos.telefones', [...telefones, '']);
  };
  
  const removeTelefone = (index) => {
    const telefones = getValues('contatos.telefones');
    if (telefones.length > 1) {
      telefones.splice(index, 1);
      setValue('contatos.telefones', telefones);
    }
  };
  
  const addEmail = () => {
    const emails = getValues('contatos.emails');
    setValue('contatos.emails', [...emails, '']);
  };
  
  const removeEmail = (index) => {
    const emails = getValues('contatos.emails');
    if (emails.length > 1) {
      emails.splice(index, 1);
      setValue('contatos.emails', emails);
    }
  };
  
  // Manipulador para salvar o cliente
  const onSubmit = async (data) => {
    console.log('Formulário submetido com dados:', data);
    setSubmitting(true);
    
    // Adiciona os documentos aos dados do cliente
    const clienteData = {
      ...data,
      documentos: documentos
    };
    
    // Se for edição, mantém o ID
    if (cliente && cliente.id) {
      clienteData.id = cliente.id;
    }
    
    try {
      console.log('Enviando dados para o backend:', clienteData);
      const result = await saveCliente(clienteData);
      
      console.log('Resposta do backend:', result);
      
      if (result) {
        setNotification({
          open: true,
          message: cliente ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!',
          severity: 'success'
        });
        
        // Aguarda um pouco e navega para a lista
        setTimeout(() => {
          navigate('/clientes');
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      
      setNotification({
        open: true,
        message: 'Erro ao salvar cliente: ' + (error.message || 'Erro desconhecido'),
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
              onClick={() => navigate('/clientes')}
              sx={{ mr: 2 }}
            >
              Voltar
            </Button>
            <Typography variant="h5" component="h2">
              {cliente ? 'Editar Cliente' : 'Novo Cliente'}
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
              {/* Seção de Dados Pessoais */}
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Informações Pessoais
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                  <Controller
                    name="nome"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Nome Completo"
                        fullWidth
                        error={!!errors.nome}
                        helperText={errors.nome?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="cpfCnpj"
                    control={control}
                    render={({ field }) => (
                      <ReactInputMask
                        mask={field.value.replace(/[^\d]/g, '').length <= 11 ? "999.999.999-99" : "99.999.999/9999-99"}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        {(inputProps) => (
                          <TextField
                            {...inputProps}
                            label="CPF/CNPJ"
                            fullWidth
                            error={!!errors.cpfCnpj}
                            helperText={errors.cpfCnpj?.message}
                          />
                        )}
                      </ReactInputMask>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="dataNascimento"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Data de Nascimento"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={!!errors.dataNascimento}
                        helperText={errors.dataNascimento?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              
              {/* Seção de Endereço */}
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Endereço
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="endereco.cep"
                    control={control}
                    render={({ field }) => (
                      <ReactInputMask
                        mask="99999-999"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        {(inputProps) => (
                          <TextField
                            {...inputProps}
                            label="CEP"
                            fullWidth
                            error={!!errors.endereco?.cep}
                            helperText={errors.endereco?.cep?.message}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocationIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      </ReactInputMask>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Controller
                    name="endereco.logradouro"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Logradouro"
                        fullWidth
                        error={!!errors.endereco?.logradouro}
                        helperText={errors.endereco?.logradouro?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="endereco.numero"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Número"
                        fullWidth
                        error={!!errors.endereco?.numero}
                        helperText={errors.endereco?.numero?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Controller
                    name="endereco.complemento"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Complemento"
                        fullWidth
                        error={!!errors.endereco?.complemento}
                        helperText={errors.endereco?.complemento?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="endereco.bairro"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Bairro"
                        fullWidth
                        error={!!errors.endereco?.bairro}
                        helperText={errors.endereco?.bairro?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <Controller
                    name="endereco.cidade"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Cidade"
                        fullWidth
                        error={!!errors.endereco?.cidade}
                        helperText={errors.endereco?.cidade?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller
                    name="endereco.estado"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Estado"
                        fullWidth
                        error={!!errors.endereco?.estado}
                        helperText={errors.endereco?.estado?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              
              {/* Seção de Contatos */}
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Contatos
              </Typography>
              
              {/* Telefones */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Telefones
                </Typography>
                {getValues('contatos.telefones').map((telefone, index) => (
                  <Grid container spacing={2} key={`telefone-${index}`} sx={{ mb: 1 }}>
                    <Grid item xs>
                      <Controller
                        name={`contatos.telefones[${index}]`}
                        control={control}
                        render={({ field }) => (
                          <ReactInputMask
                            mask={field.value.replace(/[^\d]/g, '').length <= 10 ? "(99) 9999-9999" : "(99) 99999-9999"}
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {(inputProps) => (
                              <TextField
                                {...inputProps}
                                label={`Telefone ${index + 1}`}
                                fullWidth
                                error={!!errors.contatos?.telefones?.[index]}
                                helperText={errors.contatos?.telefones?.[index]?.message}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <PhoneIcon />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          </ReactInputMask>
                        )}
                      />
                    </Grid>
                    <Grid item xs="auto">
                      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <IconButton 
                          color="error" 
                          onClick={() => removeTelefone(index)}
                          disabled={getValues('contatos.telefones').length <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        {index === getValues('contatos.telefones').length - 1 && (
                          <IconButton color="primary" onClick={addTelefone}>
                            <AddIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                ))}
              </Box>
              
              {/* Emails */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  E-mails
                </Typography>
                {getValues('contatos.emails').map((email, index) => (
                  <Grid container spacing={2} key={`email-${index}`} sx={{ mb: 1 }}>
                    <Grid item xs>
                      <Controller
                        name={`contatos.emails[${index}]`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={`E-mail ${index + 1}`}
                            fullWidth
                            error={!!errors.contatos?.emails?.[index]}
                            helperText={errors.contatos?.emails?.[index]?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs="auto">
                      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <IconButton 
                          color="error" 
                          onClick={() => removeEmail(index)}
                          disabled={getValues('contatos.emails').length <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        {index === getValues('contatos.emails').length - 1 && (
                          <IconButton color="primary" onClick={addEmail}>
                            <AddIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />
              
              {/* Seção de Documentos */}
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Documentos
              </Typography>
              <DocumentosUpload 
                documentos={documentos} 
                onChange={setDocumentos} 
              />
            </Paper>
            
            {/* Botões de Ação */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/clientes')}
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

export default ClienteForm;