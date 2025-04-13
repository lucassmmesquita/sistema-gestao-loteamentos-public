import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Switch,
  FormControlLabel,
  Alert,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import {
  Settings,
  Save,
  ArrowBack,
  Add,
  Delete,
  Help
} from '@mui/icons-material';

import { InadimplenciaProvider } from '../../contexts/InadimplenciaContext';
import GatilhosAutomaticos from '../../components/inadimplencia/GatilhosAutomaticos';

/**
 * Página de configuração de gatilhos
 * @returns {JSX.Element} - Componente renderizado
 */
const ConfiguracaoGatilhos = () => {
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados para as configurações
  const [configuracoes, setConfiguracoes] = useState({
    executarAutomaticamente: true,
    horarioExecucao: '03:00',
    diasExecucao: ['1', '15'],
    repetirCobrancas: false,
    intervaloRepeticao: 7,
    limitarRepeticoes: true,
    limiteRepeticoes: 3,
    gerarLog: true
  });
  
  // Função para atualizar uma configuração
  const atualizarConfiguracao = (campo, valor) => {
    setConfiguracoes(prev => ({
      ...prev,
      [campo]: valor
    }));
  };
  
  // Manipulador para dias de execução
  const handleDiasExecucaoChange = (event) => {
    const {
      target: { value },
    } = event;
    
    // Em arrays, podemos usar tipos primitivos diretamente
    atualizarConfiguracao('diasExecucao', typeof value === 'string' ? value.split(',') : value);
  };
  
  // Função para salvar configurações
  const salvarConfiguracoes = () => {
    // Aqui implementaríamos a lógica de salvamento na API
    navigate('/inadimplencia');
  };
  
  return (
    <InadimplenciaProvider>
      {/* Título da página */}
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
          Configuração de Gatilhos
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/inadimplencia')}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 500,
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease'
              }
            }}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={salvarConfiguracoes}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 500,
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease'
              }
            }}
          >
            Salvar
          </Button>
        </Box>
      </Box>
      
      {/* Configurações de execução */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          boxShadow: 2
        }} 
        elevation={2}
      >
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            fontSize: '1.125rem',
            color: theme.palette.primary.main
          }}
        >
          Configurações de Execução Automática
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch 
                  checked={configuracoes.executarAutomaticamente} 
                  onChange={(e) => atualizarConfiguracao('executarAutomaticamente', e.target.checked)}
                  color="primary"
                />
              }
              label="Executar gatilhos automaticamente"
              sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Horário de Execução"
              type="time"
              value={configuracoes.horarioExecucao}
              onChange={(e) => atualizarConfiguracao('horarioExecucao', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              fullWidth
              disabled={!configuracoes.executarAutomaticamente}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="dias-execucao-label">Dias do Mês</InputLabel>
              <Select
                labelId="dias-execucao-label"
                multiple
                value={configuracoes.diasExecucao}
                onChange={handleDiasExecucaoChange}
                label="Dias do Mês"
                disabled={!configuracoes.executarAutomaticamente}
                renderValue={(selected) => selected.join(', ')}
                sx={{ borderRadius: 2 }}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((dia) => (
                  <MenuItem key={dia} value={dia.toString()}>
                    {dia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Alert 
              severity="info" 
              icon={<Help />}
              sx={{ borderRadius: 2 }}
            >
              Os gatilhos automáticos serão executados nos dias e horários selecionados.
            </Alert>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            fontSize: '1.125rem',
            color: theme.palette.primary.main
          }}
        >
          Configurações de Repetição
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch 
                  checked={configuracoes.repetirCobrancas} 
                  onChange={(e) => atualizarConfiguracao('repetirCobrancas', e.target.checked)}
                  color="primary"
                />
              }
              label="Repetir cobranças não respondidas"
              sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Intervalo de Repetição (dias)"
              type="number"
              value={configuracoes.intervaloRepeticao}
              onChange={(e) => atualizarConfiguracao('intervaloRepeticao', e.target.value)}
              fullWidth
              disabled={!configuracoes.repetirCobrancas}
              InputProps={{
                inputProps: { min: 1, max: 30 }
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={configuracoes.limitarRepeticoes} 
                    onChange={(e) => atualizarConfiguracao('limitarRepeticoes', e.target.checked)}
                    disabled={!configuracoes.repetirCobrancas}
                    color="primary"
                  />
                }
                label="Limitar número de repetições"
                sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
              />
              
              <TextField
                label="Máximo de Repetições"
                type="number"
                value={configuracoes.limiteRepeticoes}
                onChange={(e) => atualizarConfiguracao('limiteRepeticoes', e.target.value)}
                fullWidth
                margin="normal"
                disabled={!configuracoes.repetirCobrancas || !configuracoes.limitarRepeticoes}
                InputProps={{
                  inputProps: { min: 1, max: 10 }
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Alert 
              severity="info" 
              icon={<Help />}
              sx={{ borderRadius: 2 }}
            >
              As cobranças serão repetidas automaticamente se não houver resposta do cliente.
            </Alert>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            fontSize: '1.125rem',
            color: theme.palette.primary.main
          }}
        >
          Outras Configurações
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch 
                  checked={configuracoes.gerarLog} 
                  onChange={(e) => atualizarConfiguracao('gerarLog', e.target.checked)}
                  color="primary"
                />
              }
              label="Gerar log detalhado de execução"
              sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Gatilhos Automáticos */}
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          fontSize: '1.3rem',
          mb: 2,
          color: theme.palette.text.primary
        }}
      >
        Configuração de Gatilhos de Comunicação
      </Typography>
      
      <GatilhosAutomaticos />
    </InadimplenciaProvider>
  );
};

export default ConfiguracaoGatilhos;