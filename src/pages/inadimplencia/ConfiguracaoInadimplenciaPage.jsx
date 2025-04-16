// src/pages/inadimplencia/ConfiguracaoInadimplenciaPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Save as SaveIcon,
  Settings as SettingsIcon,
  NotificationsActive as NotificationsIcon,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useInadimplenciaContext } from '../../contexts/InadimplenciaContext';
import Loading from '../../components/common/Loading';

const ConfiguracaoInadimplenciaPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { gatilhos, loading, atualizarGatilhos } = useInadimplenciaContext();
  
  const [formData, setFormData] = useState({
    executarAutomaticamente: true,
    horarioExecucao: '03:00',
    diasExecucao: ['1', '15'],
    repetirCobrancas: true,
    intervaloRepeticao: 7,
    limitarRepeticoes: true,
    limiteRepeticoes: 3,
    gerarLog: true,
    gatilhos: [
      { dias: 7, tipo: 'email', ativo: true, mensagem: 'Prezado cliente, identificamos que você possui uma parcela com vencimento em 7 dias. Por favor, efetue o pagamento em dia para evitar juros e multas.' },
      { dias: 15, tipo: 'sms', ativo: true, mensagem: 'Sua parcela está em atraso há 15 dias. Entre em contato conosco para regularização.' },
      { dias: 30, tipo: 'whatsapp', ativo: true, mensagem: 'Importante: Parcela em atraso há 30 dias. Acesse o link para regularizar sua situação e evitar negativação do seu CPF.' }
    ]
  });
  
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Carregar dados atuais
  useEffect(() => {
    if (gatilhos && gatilhos.length > 0) {
      setFormData(prev => ({
        ...prev,
        gatilhos
      }));
    }
  }, [gatilhos]);
  
  // Manipulador para alteração nos campos
  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    
    if (name.includes('switch-')) {
      const fieldName = name.replace('switch-', '');
      setFormData(prev => ({
        ...prev,
        [fieldName]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Manipulador para alteração nos gatilhos
  const handleGatilhoChange = (index, field, value) => {
    const newGatilhos = [...formData.gatilhos];
    
    if (field === 'ativo') {
      newGatilhos[index].ativo = value;
    } else {
      newGatilhos[index][field] = value;
    }
    
    setFormData(prev => ({
      ...prev,
      gatilhos: newGatilhos
    }));
  };
  
  // Manipulador para salvar
  const handleSave = async () => {
    try {
      await atualizarGatilhos(formData.gatilhos);
      setNotification({
        open: true,
        message: 'Configurações salvas com sucesso!',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Erro ao salvar configurações: ' + error.message,
        severity: 'error'
      });
    }
  };
  
  // Manipulador para fechar notificação
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  return (
    <Box>
      <Loading open={loading} />
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        mb: 4,
        gap: isMobile ? 2 : 0
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}
        >
          Configuração de Cobranças
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/inadimplencia')}
          sx={{ 
            borderRadius: 2, 
            textTransform: 'none',
            fontWeight: 500 
          }}
        >
          Voltar
        </Button>
      </Box>
      
      <Typography 
        variant="subtitle1" 
        color="textSecondary"
        sx={{ mb: 4 }}
      >
        Configure os parâmetros para cobrança de clientes inadimplentes
      </Typography>
      
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2, boxShadow: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SettingsIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
          <Typography variant="h6">Configurações Gerais</Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.executarAutomaticamente}
                  onChange={handleChange}
                  name="switch-executarAutomaticamente"
                  color="primary"
                />
              }
              label="Executar automaticamente"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Horário de Execução"
              name="horarioExecucao"
              type="time"
              value={formData.horarioExecucao}
              onChange={handleChange}
              disabled={!formData.executarAutomaticamente}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.repetirCobrancas}
                  onChange={handleChange}
                  name="switch-repetirCobrancas"
                  color="primary"
                />
              }
              label="Repetir cobranças"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Intervalo de Repetição (dias)"
              name="intervaloRepeticao"
              type="number"
              value={formData.intervaloRepeticao}
              onChange={handleChange}
              disabled={!formData.repetirCobrancas}
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.limitarRepeticoes}
                  onChange={handleChange}
                  name="switch-limitarRepeticoes"
                  color="primary"
                />
              }
              label="Limitar número de repetições"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Limite de Repetições"
              name="limiteRepeticoes"
              type="number"
              value={formData.limiteRepeticoes}
              onChange={handleChange}
              disabled={!formData.limitarRepeticoes}
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <NotificationsIcon sx={{ mr: 2, color: theme.palette.secondary.main }} />
          <Typography variant="h6">Gatilhos de Cobrança</Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {formData.gatilhos.map((gatilho, index) => (
          <Box key={index} sx={{ mb: 4, pb: 2, borderBottom: index !== formData.gatilhos.length - 1 ? '1px dashed' : 'none', borderColor: 'divider' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={500}>
                  Gatilho {index + 1}: {gatilho.dias} dias 
                  {gatilho.dias < 0 ? ' antes do vencimento' : ' após o vencimento'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={gatilho.ativo}
                      onChange={(e) => handleGatilhoChange(index, 'ativo', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Ativo"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id={`tipo-gatilho-${index}-label`}>Tipo de Comunicação</InputLabel>
                  <Select
                    labelId={`tipo-gatilho-${index}-label`}
                    value={gatilho.tipo}
                    onChange={(e) => handleGatilhoChange(index, 'tipo', e.target.value)}
                    label="Tipo de Comunicação"
                    disabled={!gatilho.ativo}
                  >
                    <MenuItem value="email">E-mail</MenuItem>
                    <MenuItem value="sms">SMS</MenuItem>
                    <MenuItem value="whatsapp">WhatsApp</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Mensagem"
                  value={gatilho.mensagem}
                  onChange={(e) => handleGatilhoChange(index, 'mensagem', e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  disabled={!gatilho.ativo}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease'
              }
            }}
          >
            Salvar Configurações
          </Button>
        </Box>
      </Paper>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfiguracaoInadimplenciaPage;