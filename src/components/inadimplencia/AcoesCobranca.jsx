import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Alert,
  AlertTitle,
  Chip,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Avatar
} from '@mui/material';
import {
  ArrowBack,
  Refresh,
  Email,
  WhatsApp,
  Sms,
  AttachFile,
  HistoryEdu,
  Receipt,
  UploadFile,
  Delete,
  Send,
  Person,
  PhoneAndroid,
  Language
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useInadimplencia } from '../../hooks/useInadimplencia';
import HistoricoInteracoes from './HistoricoInteracoes';
import StatusPagamento from './StatusPagamento';

// Componente principal
const AcoesCobranca = () => {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const {
    clienteAtual,
    historicoInteracoes,
    historicoComunicacoes,
    loadingDetalhes,
    errorDetalhes,
    carregarDetalhesCliente,
    enviarComunicacaoManual,
    registrarInteracao,
    gerarNovoBoleto,
    formatarValor,
    calcularDiasAtraso
  } = useInadimplencia(clienteId);
  
  // Estados locais
  const [tabAtual, setTabAtual] = useState(0);
  const [dialogCobrancaAberto, setDialogCobrancaAberto] = useState(false);
  const [dialogInteracaoAberto, setDialogInteracaoAberto] = useState(false);
  const [dialogBoletoAberto, setDialogBoletoAberto] = useState(false);
  const [tipoCobranca, setTipoCobranca] = useState('email');
  const [mensagemCobranca, setMensagemCobranca] = useState('');
  const [anexos, setAnexos] = useState([]);
  const [parcelaSelecionada, setParcelaSelecionada] = useState(null);
  const [tipoInteracao, setTipoInteracao] = useState('telefone');
  const [observacaoInteracao, setObservacaoInteracao] = useState('');
  const [notificacao, setNotificacao] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Carregar detalhes do cliente quando o componente montar
  useEffect(() => {
    carregarDetalhesCliente(clienteId);
  }, [clienteId, carregarDetalhesCliente]);
  
  // Manipuladores para tabs
  const handleTabChange = (event, newValue) => {
    setTabAtual(newValue);
  };
  
  // Abrir dialog de cobrança
  const abrirDialogCobranca = (parcela) => {
    setParcelaSelecionada(parcela);
    
    // Definir mensagem padrão baseada no tipo de cobrança
    const diasAtraso = calcularDiasAtraso(parcela.dataVencimento);
    const valorFormatado = formatarValor(parcela.valor);
    const dataVencimento = format(new Date(parcela.dataVencimento), 'dd/MM/yyyy');
    
    setMensagemCobranca(
      `Prezado(a) ${clienteAtual?.nome},\n\n` +
      `Identificamos que a parcela ${parcela.numero} do seu contrato, com vencimento em ${dataVencimento} ` +
      `no valor de ${valorFormatado}, encontra-se em atraso por ${diasAtraso} dias.\n\n` +
      `Por favor, entre em contato conosco para regularizar a situação ou acesse nosso site para emissão de um novo boleto.\n\n` +
      `Atenciosamente,\nEquipe de Cobrança`
    );
    
    setDialogCobrancaAberto(true);
  };
  
  // Abrir dialog de interação
  const abrirDialogInteracao = (parcela) => {
    setParcelaSelecionada(parcela);
    setDialogInteracaoAberto(true);
  };
  
  // Abrir dialog de boleto
  const abrirDialogBoleto = (parcela) => {
    setParcelaSelecionada(parcela);
    setDialogBoletoAberto(true);
  };
  
  // Enviar cobrança
  const enviarCobranca = async () => {
    setLoading(true);
    try {
      const resultado = await enviarComunicacaoManual(
        clienteId,
        tipoCobranca,
        mensagemCobranca,
        anexos
      );
      
      setNotificacao({
        tipo: resultado.sucesso ? 'success' : 'error',
        mensagem: resultado.mensagem
      });
      
      if (resultado.sucesso) {
        setDialogCobrancaAberto(false);
        // Limpar formulário
        setMensagemCobranca('');
        setAnexos([]);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Registrar interação
  const salvarInteracao = async () => {
    setLoading(true);
    try {
      const resultado = await registrarInteracao(clienteId, {
        tipo: tipoInteracao,
        observacao: observacaoInteracao,
        parcelaId: parcelaSelecionada?.id,
        data: new Date().toISOString()
      });
      
      setNotificacao({
        tipo: resultado.sucesso ? 'success' : 'error',
        mensagem: resultado.mensagem
      });
      
      if (resultado.sucesso) {
        setDialogInteracaoAberto(false);
        // Limpar formulário
        setObservacaoInteracao('');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Gerar novo boleto
  const gerarBoleto = async () => {
    setLoading(true);
    try {
      const resultado = await gerarNovoBoleto(clienteId, parcelaSelecionada.id);
      
      setNotificacao({
        tipo: resultado.sucesso ? 'success' : 'error',
        mensagem: resultado.mensagem
      });
      
      if (resultado.sucesso) {
        setDialogBoletoAberto(false);
        
        // Baixar boleto gerado
        if (resultado.boleto?.url) {
          window.open(resultado.boleto.url, '_blank');
        }
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Manipular upload de anexos
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setAnexos(prevAnexos => [...prevAnexos, ...files]);
  };
  
  // Remover anexo
  const removerAnexo = (index) => {
    setAnexos(prevAnexos => prevAnexos.filter((_, i) => i !== index));
  };
  
  if (loadingDetalhes && !clienteAtual) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (errorDetalhes) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        <AlertTitle>Erro</AlertTitle>
        {errorDetalhes}
      </Alert>
    );
  }
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Notificação */}
      {notificacao && (
        <Alert 
          severity={notificacao.tipo} 
          sx={{ mb: 3 }}
          onClose={() => setNotificacao(null)}
        >
          {notificacao.mensagem}
        </Alert>
      )}
      
      {/* Cabeçalho */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 56, 
                height: 56, 
                bgcolor: theme.palette.primary.main 
              }}
            >
              {clienteAtual?.nome?.charAt(0) || 'C'}
            </Avatar>
            <Box>
              <Typography variant="h5">{clienteAtual?.nome}</Typography>
              <Typography variant="body2" color="textSecondary">
                {clienteAtual?.documento}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBack />}
              onClick={() => navigate('/inadimplencia')}
            >
              Voltar
            </Button>
            <Button 
              variant="contained" 
              startIcon={<Refresh />}
              onClick={() => carregarDetalhesCliente(clienteId)}
            >
              Atualizar
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Informações de contato */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email color="action" fontSize="small" />
              <Typography variant="body2">{clienteAtual?.email || 'Não informado'}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneAndroid color="action" fontSize="small" />
              <Typography variant="body2">{clienteAtual?.telefone || 'Não informado'}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Language color="action" fontSize="small" />
              <Typography variant="body2">Contrato: {clienteAtual?.contrato?.numero || 'Não informado'}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Conteúdo principal */}
      <Grid container spacing={3}>
        {/* Coluna esquerda - parcelas em atraso */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Parcelas em Atraso
            </Typography>
            
            {clienteAtual?.parcelas?.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                Este cliente não possui parcelas em atraso.
              </Alert>
            ) : (
              <Box sx={{ mt: 2 }}>
                {clienteAtual?.parcelas?.map((parcela) => (
                  <Card key={parcela.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardHeader
                      title={`Parcela ${parcela.numero}`}
                      subheader={`Vencimento: ${format(new Date(parcela.dataVencimento), 'dd/MM/yyyy')}`}
                      action={
                        <Chip 
                          label={`${calcularDiasAtraso(parcela.dataVencimento)} dias`}
                          color={
                            calcularDiasAtraso(parcela.dataVencimento) > 30 ? 'error' : 
                            calcularDiasAtraso(parcela.dataVencimento) > 15 ? 'warning' : 
                            'info'
                          }
                          size="small"
                        />
                      }
                    />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">
                            Valor Original
                          </Typography>
                          <Typography variant="body1">
                            {formatarValor(parcela.valor)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">
                            Valor Atualizado
                          </Typography>
                          <Typography variant="body1">
                            {formatarValor(parcela.valorAtualizado)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                          Status
                        </Typography>
                        <StatusPagamento 
                          status={parcela.status || 'em_aberto'} 
                          size="small"
                        />
                      </Box>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        startIcon={<Email />}
                        onClick={() => abrirDialogCobranca(parcela)}
                      >
                        Enviar Cobrança
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        startIcon={<HistoryEdu />}
                        onClick={() => abrirDialogInteracao(parcela)}
                      >
                        Registrar Contato
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        startIcon={<Receipt />}
                        onClick={() => abrirDialogBoleto(parcela)}
                      >
                        Gerar Boleto
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Coluna direita - histórico */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <Tabs 
              value={tabAtual} 
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
            >
              <Tab label="Histórico de Interações" />
              <Tab label="Histórico de Cobranças" />
            </Tabs>
            
            <Box sx={{ mt: 2 }}>
              {tabAtual === 0 && (
                <HistoricoInteracoes 
                  interacoes={historicoInteracoes} 
                  loading={loadingDetalhes}
                />
              )}
              
              {tabAtual === 1 && (
                <HistoricoInteracoes 
                  interacoes={historicoComunicacoes}
                  loading={loadingDetalhes}
                  tipo="comunicacao"
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialog de Cobrança */}
      <Dialog 
        open={dialogCobrancaAberto} 
        onClose={() => setDialogCobrancaAberto(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Enviar Cobrança - Parcela {parcelaSelecionada?.numero}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enviar comunicação de cobrança para {clienteAtual?.nome} referente à parcela 
            com vencimento em {parcelaSelecionada ? format(new Date(parcelaSelecionada.dataVencimento), 'dd/MM/yyyy') : ''}.
          </DialogContentText>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Comunicação</InputLabel>
            <Select
              value={tipoCobranca}
              label="Tipo de Comunicação"
              onChange={(e) => setTipoCobranca(e.target.value)}
            >
              <MenuItem value="email">E-mail</MenuItem>
              <MenuItem value="sms">SMS</MenuItem>
              <MenuItem value="whatsapp">WhatsApp</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            label="Mensagem"
            multiline
            rows={6}
            fullWidth
            value={mensagemCobranca}
            onChange={(e) => setMensagemCobranca(e.target.value)}
          />
          
          {tipoCobranca === 'email' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Anexos
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {anexos.map((anexo, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachFile fontSize="small" />
                      <Typography variant="body2">
                        {anexo.name} ({(anexo.size / 1024).toFixed(2)} KB)
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => removerAnexo(index)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFile />}
                  sx={{ mt: 1 }}
                >
                  Adicionar Anexo
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDialogCobrancaAberto(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={enviarCobranca}
            variant="contained"
            startIcon={<Send />}
            disabled={!mensagemCobranca || loading}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog de Interação */}
      <Dialog 
        open={dialogInteracaoAberto} 
        onClose={() => setDialogInteracaoAberto(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Registrar Contato - Parcela {parcelaSelecionada?.numero}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Registre um contato realizado com o cliente {clienteAtual?.nome} referente à parcela 
            com vencimento em {parcelaSelecionada ? format(new Date(parcelaSelecionada.dataVencimento), 'dd/MM/yyyy') : ''}.
          </DialogContentText>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Contato</InputLabel>
            <Select
              value={tipoInteracao}
              label="Tipo de Contato"
              onChange={(e) => setTipoInteracao(e.target.value)}
            >
              <MenuItem value="telefone">Telefone</MenuItem>
              <MenuItem value="whatsapp">WhatsApp</MenuItem>
              <MenuItem value="email">E-mail</MenuItem>
              <MenuItem value="presencial">Presencial</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            label="Observação"
            multiline
            rows={4}
            fullWidth
            value={observacaoInteracao}
            onChange={(e) => setObservacaoInteracao(e.target.value)}
            placeholder="Descreva o que foi conversado com o cliente..."
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDialogInteracaoAberto(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={salvarInteracao}
            variant="contained"
            startIcon={<HistoryEdu />}
            disabled={!observacaoInteracao || loading}
          >
            {loading ? 'Salvando...' : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog de Boleto */}
      <Dialog 
        open={dialogBoletoAberto} 
        onClose={() => setDialogBoletoAberto(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Gerar Novo Boleto - Parcela {parcelaSelecionada?.numero}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Gerar um novo boleto para o cliente {clienteAtual?.nome} referente à parcela 
            com vencimento em {parcelaSelecionada ? format(new Date(parcelaSelecionada.dataVencimento), 'dd/MM/yyyy') : ''}.
          </DialogContentText>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <AlertTitle>Atenção</AlertTitle>
            O valor do boleto será atualizado automaticamente com juros e multa conforme as regras do contrato.
            <Typography variant="body2" sx={{ mt: 1 }}>
              Valor original: {parcelaSelecionada ? formatarValor(parcelaSelecionada.valor) : '-'}<br />
              Valor atualizado: {parcelaSelecionada ? formatarValor(parcelaSelecionada.valorAtualizado) : '-'}
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDialogBoletoAberto(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={gerarBoleto}
            variant="contained"
            startIcon={<Receipt />}
            disabled={loading}
          >
            {loading ? 'Gerando...' : 'Gerar Boleto'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AcoesCobranca;