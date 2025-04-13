import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, Button, 
  FormControl, FormHelperText, InputLabel, Select, MenuItem,
  InputAdornment, Divider, Alert, CircularProgress,
  useMediaQuery, Slider, Tooltip
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { 
  Save, Settings, ArrowBack, 
  Calculate, CalendarMonth, Tune, TrendingUp
} from '@mui/icons-material';
import { useReajusteContext } from '../../contexts/ReajusteContext';
import { useNavigate } from 'react-router-dom';

// Estilos personalizados
const HeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(45deg, #1a1a1a 30%, #2c2c2c 90%)' 
    : 'linear-gradient(45deg, #f7f7f7 30%, #ffffff 90%)',
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 500,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.text.secondary,
  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const TitleWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const FormSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

// Componente principal
const ConfiguracaoReajustesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Context
  const { parametrosReajuste, salvarParametros, loading } = useReajusteContext();
  
  // Estados
  const [formState, setFormState] = useState({
    indiceBase: 'IGPM',
    percentualAdicional: 6,
    intervaloParcelas: 12,
    alertaAntecipadoDias: 30
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Efeito para carregar parâmetros atuais
  useEffect(() => {
    setFormState(parametrosReajuste);
  }, [parametrosReajuste]);
  
  // Handlers
  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormState(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSliderChange = (field) => (event, newValue) => {
    setFormState(prev => ({ ...prev, [field]: newValue }));
  };
  
  const handleGoBack = () => {
    navigate('/reajustes');
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formState.indiceBase) {
      newErrors.indiceBase = 'Selecione um índice econômico';
    }
    
    if (formState.percentualAdicional < 0) {
      newErrors.percentualAdicional = 'O percentual adicional não pode ser negativo';
    }
    
    if (!formState.intervaloParcelas || formState.intervaloParcelas < 1) {
      newErrors.intervaloParcelas = 'O intervalo de parcelas deve ser maior que zero';
    }
    
    if (!formState.alertaAntecipadoDias || formState.alertaAntecipadoDias < 1) {
      newErrors.alertaAntecipadoDias = 'O alerta antecipado deve ser maior que zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSalvar = async () => {
    if (!validateForm()) return;
    
    try {
      await salvarParametros(formState);
      setShowSuccess(true);
      
      // Esconder a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Erro ao salvar parâmetros:', error);
    }
  };
  
  return (
    <Box sx={{ 
      padding: isMobile ? theme.spacing(2) : theme.spacing(3),
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      {/* Cabeçalho */}
      <HeaderPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TitleWrapper>
            <IconWrapper>
              <Settings />
            </IconWrapper>
            <Box>
              <SectionTitle variant="h1">
                Configuração de Reajustes
              </SectionTitle>
              <SectionSubtitle variant="subtitle1">
                Defina os parâmetros para o cálculo automático de reajustes
              </SectionSubtitle>
            </Box>
          </TitleWrapper>
          
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            onClick={handleGoBack}
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Voltar
          </Button>
        </Box>
      </HeaderPaper>
      
      {/* Mensagem de sucesso */}
      {showSuccess && (
        <Alert 
          severity="success" 
          sx={{ marginBottom: theme.spacing(3), borderRadius: '8px' }}
        >
          Parâmetros salvos com sucesso!
        </Alert>
      )}
      
      {/* Formulário */}
      <ContentPaper>
        <Grid container spacing={4}>
          {/* Configurações básicas */}
          <Grid item xs={12} md={6}>
            <FormSection>
              <FormSectionTitle variant="h6">
                <Calculate fontSize="small" color="primary" />
                Configurações do Índice
              </FormSectionTitle>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.indiceBase}>
                    <InputLabel id="indice-base-label">Índice Econômico</InputLabel>
                    <Select
                      labelId="indice-base-label"
                      value={formState.indiceBase}
                      onChange={handleInputChange('indiceBase')}
                      label="Índice Econômico"
                      startAdornment={
                        <InputAdornment position="start">
                          <TrendingUp fontSize="small" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="IGPM">IGPM</MenuItem>
                      <MenuItem value="IPCA">IPCA</MenuItem>
                      <MenuItem value="INPC">INPC</MenuItem>
                    </Select>
                    <FormHelperText>
                      {errors.indiceBase || 'Selecione o índice econômico padrão para reajustes'}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography gutterBottom>
                    Percentual Adicional: {formState.percentualAdicional}%
                  </Typography>
                  <Slider
                    value={formState.percentualAdicional}
                    onChange={handleSliderChange('percentualAdicional')}
                    aria-labelledby="percentual-adicional-slider"
                    valueLabelDisplay="auto"
                    step={0.5}
                    marks
                    min={0}
                    max={15}
                    valueLabelFormat={(value) => `${value}%`}
                  />
                  <FormHelperText error={!!errors.percentualAdicional}>
                    {errors.percentualAdicional || 'Percentual adicional sobre o índice econômico (ex: IGPM + 6%)'}
                  </FormHelperText>
                </Grid>
              </Grid>
            </FormSection>
          </Grid>
          
          {/* Configurações de intervalo */}
          <Grid item xs={12} md={6}>
            <FormSection>
              <FormSectionTitle variant="h6">
                <CalendarMonth fontSize="small" color="primary" />
                Configurações de Período
              </FormSectionTitle>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Intervalo de Parcelas"
                    type="number"
                    fullWidth
                    value={formState.intervaloParcelas}
                    onChange={handleInputChange('intervaloParcelas')}
                    error={!!errors.intervaloParcelas}
                    helperText={errors.intervaloParcelas || 'Intervalo de parcelas para aplicar reajuste (ex: a cada 12 parcelas)'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tune fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                    inputProps={{ min: 1, max: 60 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Alerta Antecipado (Dias)"
                    type="number"
                    fullWidth
                    value={formState.alertaAntecipadoDias}
                    onChange={handleInputChange('alertaAntecipadoDias')}
                    error={!!errors.alertaAntecipadoDias}
                    helperText={errors.alertaAntecipadoDias || 'Dias de antecedência para alertar sobre reajustes próximos'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonth fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">dias</InputAdornment>
                      )
                    }}
                    inputProps={{ min: 1, max: 90 }}
                  />
                </Grid>
              </Grid>
            </FormSection>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Resumo da configuração */}
        <Box sx={{ mb: 3 }}>
          <Alert 
            severity="info" 
            sx={{ borderRadius: '8px' }}
          >
            <Typography variant="body2">
              <strong>Resumo da configuração:</strong> Aplicar reajuste a cada <strong>{formState.intervaloParcelas} parcelas</strong> utilizando o índice <strong>{formState.indiceBase} + {formState.percentualAdicional}%</strong>.
              O sistema alertará sobre reajustes <strong>{formState.alertaAntecipadoDias} dias</strong> antes da data prevista.
            </Typography>
          </Alert>
        </Box>
        
        {/* Botões de ação */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleGoBack}
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Cancelar
          </Button>
          
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSalvar}
            disabled={loading}
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </Box>
      </ContentPaper>
    </Box>
  );
};

export default ConfiguracaoReajustesPage;