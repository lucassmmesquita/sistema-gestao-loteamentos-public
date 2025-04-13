import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  Switch,
  Button,
  IconButton,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  useMediaQuery,
  useTheme,
  Collapse
} from '@mui/material';
import {
  Add,
  Delete,
  Save,
  Edit,
  Refresh,
  SettingsBackupRestore,
  CheckCircle,
  Email,
  Sms,
  WhatsApp,
  PlayArrow,
  Help
} from '@mui/icons-material';
import { useInadimplenciaContext } from '../../contexts/InadimplenciaContext';
import { comunicacaoService } from '../../services/comunicacaoService';

const GatilhosAutomaticos = () => {
  const { gatilhos, atualizarGatilhos, executarGatilhosAutomaticos } = useInadimplenciaContext();
  const [gatilhosEditados, setGatilhosEditados] = useState([...gatilhos]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [testeDialogOpen, setTesteDialogOpen] = useState(false);
  const [resultadoTeste, setResultadoTeste] = useState(null);
  const [tipoTeste, setTipoTeste] = useState('email');
  const [destinatarioTeste, setDestinatarioTeste] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandido, setExpandido] = useState({});
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Função para alternar expandido
  const toggleExpandido = (index) => {
    setExpandido(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Função para atualizar um gatilho específico
  const atualizarGatilho = (index, campo, valor) => {
    const novosGatilhos = [...gatilhosEditados];
    novosGatilhos[index] = {
      ...novosGatilhos[index],
      [campo]: valor
    };
    setGatilhosEditados(novosGatilhos);
  };
  
  // Função para adicionar novo gatilho
  const adicionarGatilho = () => {
    setGatilhosEditados([
      ...gatilhosEditados,
      {
        dias: 10,
        tipo: 'email',
        ativo: true,
        mensagem: 'Prezado cliente, identificamos que você possui uma parcela em atraso. Por favor, regularize seu pagamento.'
      }
    ]);
    // Expandir o novo gatilho automaticamente
    setExpandido(prev => ({
      ...prev,
      [gatilhosEditados.length]: true
    }));
  };
  
  // Função para remover um gatilho
  const removerGatilho = (index) => {
    const novosGatilhos = [...gatilhosEditados];
    novosGatilhos.splice(index, 1);
    setGatilhosEditados(novosGatilhos);
  };
  
  // Função para salvar alterações
  const salvarAlteracoes = () => {
    atualizarGatilhos(gatilhosEditados);
    setModoEdicao(false);
  };
  
  // Função para cancelar alterações
  const cancelarAlteracoes = () => {
    setGatilhosEditados([...gatilhos]);
    setModoEdicao(false);
  };
  
  // Função para testar comunicação
  const abrirDialogTeste = (tipo) => {
    setTipoTeste(tipo);
    setDestinatarioTeste('');
    setResultadoTeste(null);
    setTesteDialogOpen(true);
  };
  
  // Função para executar teste
  const executarTeste = async () => {
    setLoading(true);
    setResultadoTeste(null);
    
    try {
      // Obter modelo de mensagem baseado no tipo
      const tipoGatilho = gatilhosEditados.find(g => g.tipo === tipoTeste);
      const mensagemTeste = tipoGatilho ? tipoGatilho.mensagem : 'Mensagem de teste de comunicação.';
      
      // Executar teste
      const resultado = await comunicacaoService.testarComunicacao(
        tipoTeste, 
        destinatarioTeste, 
        mensagemTeste
      );
      
      setResultadoTeste({
        sucesso: true,
        mensagem: `Teste de ${tipoTeste} enviado com sucesso para ${destinatarioTeste}.`
      });
    } catch (error) {
      console.error('Erro ao testar comunicação:', error);
      setResultadoTeste({
        sucesso: false,
        mensagem: `Erro ao enviar ${tipoTeste}: ${error.message || 'Erro desconhecido'}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Função para executar todos os gatilhos
  const executarTodosGatilhos = async () => {
    setLoading(true);
    try {
      const resultado = await executarGatilhosAutomaticos();
      // Notification or message about result
    } finally {
      setLoading(false);
    }
  };
  
  // Função para renderizar ícone baseado no tipo de comunicação
  const renderizarIconeTipo = (tipo) => {
    switch (tipo) {
      case 'email':
        return <Email />;
      case 'sms':
        return <Sms />;
      case 'whatsapp':
        return <WhatsApp />;
      default:
        return <Email />;
    }
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          mb: 2,
          gap: isMobile ? 2 : 0
        }}>
          <Box>
            <Typography variant="h6">Gatilhos de Comunicação</Typography>
            <Typography variant="body2" color="textSecondary">
              Configure gatilhos automáticos para envio de comunicações aos clientes inadimplentes
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!modoEdicao ? (
              <>
                <Button 
                  variant="outlined" 
                  startIcon={<Edit />}
                  onClick={() => setModoEdicao(true)}
                >
                  Editar
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<PlayArrow />}
                  onClick={executarTodosGatilhos}
                  disabled={loading}
                >
                  Executar Agora
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  startIcon={<SettingsBackupRestore />}
                  onClick={cancelarAlteracoes}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<Save />}
                  onClick={salvarAlteracoes}
                  disabled={loading}
                >
                  Salvar
                </Button>
              </>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {/* Cards para cada gatilho */}
          {gatilhosEditados.map((gatilho, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card variant="outlined">
                <CardHeader
                  avatar={renderizarIconeTipo(gatilho.tipo)}
                  title={`Gatilho: ${gatilho.dias} dias`}
                  subheader={`Tipo: ${gatilho.tipo === 'email' ? 'E-mail' : gatilho.tipo === 'sms' ? 'SMS' : 'WhatsApp'}`}
                  action={
                    modoEdicao ? (
                      <IconButton 
                        aria-label="remover" 
                        onClick={() => removerGatilho(index)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    ) : (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={gatilho.ativo}
                            onChange={(e) => atualizarGatilho(index, 'ativo', e.target.checked)}
                            disabled={!modoEdicao}
                            color="primary"
                          />
                        }
                        label="Ativo"
                      />
                    )
                  }
                />
                
                <CardContent>
                  {modoEdicao && (
                    <Box sx={{ mb: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            label="Dias de Atraso"
                            type="number"
                            fullWidth
                            size="small"
                            value={gatilho.dias}
                            onChange={(e) => atualizarGatilho(index, 'dias', parseInt(e.target.value))}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Tipo</InputLabel>
                            <Select
                              value={gatilho.tipo}
                              label="Tipo"
                              onChange={(e) => atualizarGatilho(index, 'tipo', e.target.value)}
                            >
                              <MenuItem value="email">E-mail</MenuItem>
                              <MenuItem value="sms">SMS</MenuItem>
                              <MenuItem value="whatsapp">WhatsApp</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Mensagem:
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      mb: 1, 
                      cursor: 'pointer',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: 'background.default',
                      maxHeight: expandido[index] ? 'none' : '80px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                    onClick={() => toggleExpandido(index)}
                  >
                    {modoEdicao ? (
                      <TextField
                        multiline
                        rows={4}
                        fullWidth
                        size="small"
                        value={gatilho.mensagem}
                        onChange={(e) => atualizarGatilho(index, 'mensagem', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <>
                        <Typography variant="body2">
                          {gatilho.mensagem}
                        </Typography>
                        {!expandido[index] && gatilho.mensagem.length > 100 && (
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              bottom: 0, 
                              left: 0, 
                              right: 0,
                              height: '30px',
                              background: 'linear-gradient(transparent, rgba(255,255,255,0.9))',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'flex-end',
                              pb: 0.5
                            }}
                          >
                            <Typography variant="caption" color="primary">
                              Ver mais
                            </Typography>
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={renderizarIconeTipo(gatilho.tipo)}
                    onClick={() => abrirDialogTeste(gatilho.tipo)}
                  >
                    Testar envio
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          
          {/* Card para adicionar novo gatilho */}
          {modoEdicao && (
            <Grid item xs={12} md={6} lg={4}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  border: '1px dashed',
                  borderColor: 'divider'
                }}
              >
                <CardContent>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <IconButton 
                      color="primary" 
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        border: '1px dashed', 
                        borderColor: 'primary.main' 
                      }}
                      onClick={adicionarGatilho}
                    >
                      <Add fontSize="large" />
                    </IconButton>
                    <Typography color="textSecondary">
                      Adicionar Gatilho
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
        
        {gatilhosEditados.length === 0 && !modoEdicao && (
          <Alert 
            severity="info" 
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => setModoEdicao(true)}
              >
                Configurar
              </Button>
            }
          >
            Nenhum gatilho de comunicação configurado. Configure gatilhos para automatizar o processo de cobrança.
          </Alert>
        )}
      </Paper>
      
      {/* Dialog para teste de comunicação */}
      <Dialog open={testeDialogOpen} onClose={() => setTesteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Testar Envio de {tipoTeste === 'email' ? 'E-mail' : tipoTeste === 'sms' ? 'SMS' : 'WhatsApp'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Informe um {tipoTeste === 'email' ? 'endereço de e-mail' : 'número de telefone'} para enviar uma mensagem de teste.
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            label={tipoTeste === 'email' ? 'E-mail' : 'Telefone (com DDD)'}
            type={tipoTeste === 'email' ? 'email' : 'tel'}
            fullWidth
            value={destinatarioTeste}
            onChange={(e) => setDestinatarioTeste(e.target.value)}
            sx={{ mt: 2 }}
            disabled={loading}
          />
          
          {resultadoTeste && (
            <Alert 
              severity={resultadoTeste.sucesso ? "success" : "error"}
              sx={{ mt: 2 }}
            >
              {resultadoTeste.mensagem}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTesteDialogOpen(false)} disabled={loading}>
            Fechar
          </Button>
          <Button 
            onClick={executarTeste} 
            variant="contained" 
            disabled={!destinatarioTeste || loading}
            startIcon={renderizarIconeTipo(tipoTeste)}
          >
            {loading ? 'Enviando...' : 'Enviar Teste'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GatilhosAutomaticos;