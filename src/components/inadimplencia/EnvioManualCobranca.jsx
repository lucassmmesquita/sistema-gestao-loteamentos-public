import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Send,
  Email,
  WhatsApp,
  Sms,
  AttachFile,
  Delete,
  Clear,
  Save,
  ContentCopy,
  UploadFile
} from '@mui/icons-material';
import { useInadimplenciaContext } from '../../contexts/InadimplenciaContext';
import { comunicacaoService } from '../../services/comunicacaoService';

/**
 * Componente para envio manual de comunicações de cobrança
 * @param {Object} props - Propriedades do componente
 * @param {string} props.clienteId - ID do cliente (opcional)
 * @param {Object} props.parcelaId - ID da parcela (opcional)
 * @returns {JSX.Element} - Componente renderizado
 */
const EnvioManualCobranca = ({ clienteId, parcelaId }) => {
  const { enviarComunicacaoManual } = useInadimplenciaContext();
  const [tipoCobranca, setTipoCobranca] = useState('email');
  const [mensagem, setMensagem] = useState('');
  const [anexos, setAnexos] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(clienteId || '');
  const [parcelaSelecionada, setParcelaSelecionada] = useState(parcelaId || '');
  const [clientes, setClientes] = useState([]);
  const [parcelas, setParcelas] = useState([]);
  const [modelosMensagem, setModelosMensagem] = useState([]);
  const [modeloSelecionado, setModeloSelecionado] = useState('');
  const [carregandoClientes, setCarregandoClientes] = useState(false);
  const [carregandoParcelas, setCarregandoParcelas] = useState(false);
  const [carregandoModelos, setCarregandoModelos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [salvandoModelo, setSalvandoModelo] = useState(false);
  const [nomeNovoModelo, setNomeNovoModelo] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Carregar clientes inadimplentes ao montar o componente
  useEffect(() => {
    const carregarClientesInadimplentes = async () => {
      setCarregandoClientes(true);
      try {
        // Normalmente viria da API, mas como é um mock, vamos criar alguns dados fake
        const clientesMock = [
          { id: '1', nome: 'João Silva', documento: '123.456.789-00' },
          { id: '2', nome: 'Maria Souza', documento: '987.654.321-00' },
          { id: '3', nome: 'Pedro Oliveira', documento: '456.789.123-00' }
        ];
        setClientes(clientesMock);
        
        // Se um clienteId foi fornecido, já o seleciona
        if (clienteId) {
          setClienteSelecionado(clienteId);
          carregarParcelasCliente(clienteId);
        }
      } catch (error) {
        console.error('Erro ao carregar clientes inadimplentes:', error);
      } finally {
        setCarregandoClientes(false);
      }
    };
    
    carregarClientesInadimplentes();
  }, [clienteId]);
  
  // Carregar modelos de mensagem quando o tipo de cobrança mudar
  useEffect(() => {
    const carregarModelosMensagem = async () => {
      setCarregandoModelos(true);
      try {
        const response = await comunicacaoService.obterModelosMensagens(tipoCobranca);
        setModelosMensagem(response.data || []);
      } catch (error) {
        console.error(`Erro ao carregar modelos de mensagem para ${tipoCobranca}:`, error);
        // Como é um mock, vamos criar alguns dados fake
        const modelosMock = [
          { id: '1', nome: 'Primeira Cobrança', conteudo: 'Prezado cliente, identificamos o vencimento da sua parcela. Por favor, regularize o pagamento.' },
          { id: '2', nome: 'Segunda Cobrança', conteudo: 'Atenção! Sua parcela está em atraso há mais de 15 dias. Entre em contato conosco para evitar juros adicionais.' },
          { id: '3', nome: 'Cobrança Final', conteudo: 'URGENTE: Sua parcela está em atraso há mais de 30 dias. Regularize imediatamente para evitar inclusão em órgãos de proteção ao crédito.' }
        ];
        setModelosMensagem(modelosMock);
      } finally {
        setCarregandoModelos(false);
      }
    };
    
    carregarModelosMensagem();
  }, [tipoCobranca]);
  
  // Função para carregar parcelas de um cliente
  const carregarParcelasCliente = async (id) => {
    if (!id) return;
    
    setCarregandoParcelas(true);
    try {
      // Normalmente viria da API, mas como é um mock, vamos criar alguns dados fake
      const parcelasMock = [
        { id: '101', numero: 1, valor: 500.00, vencimento: '2023-01-10', diasAtraso: 45 },
        { id: '102', numero: 2, valor: 500.00, vencimento: '2023-02-10', diasAtraso: 15 },
        { id: '103', numero: 3, valor: 500.00, vencimento: '2023-03-10', diasAtraso: 5 }
      ];
      setParcelas(parcelasMock);
      
      // Se um parcelaId foi fornecido, já o seleciona
      if (parcelaId) {
        setParcelaSelecionada(parcelaId);
      }
    } catch (error) {
      console.error(`Erro ao carregar parcelas para cliente ${id}:`, error);
    } finally {
      setCarregandoParcelas(false);
    }
  };
  
  // Manipular mudança de cliente
  const handleClienteChange = (event) => {
    const novoClienteId = event.target.value;
    setClienteSelecionado(novoClienteId);
    carregarParcelasCliente(novoClienteId);
    setParcelaSelecionada('');
  };
  
  // Manipular mudança de parcela
  const handleParcelaChange = (event) => {
    setParcelaSelecionada(event.target.value);
  };
  
  // Manipular seleção de modelo de mensagem
  const handleModeloChange = (event) => {
    const modeloId = event.target.value;
    setModeloSelecionado(modeloId);
    
    if (modeloId) {
      const modelo = modelosMensagem.find(m => m.id === modeloId);
      if (modelo) {
        setMensagem(modelo.conteudo);
      }
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
  
  // Limpar formulário
  const limparFormulario = () => {
    setMensagem('');
    setAnexos([]);
    setModeloSelecionado('');
    setResultado(null);
    
    // Se não foram fornecidos IDs nas props, também limpa as seleções
    if (!clienteId) {
      setClienteSelecionado('');
      setParcelas([]);
    }
    if (!parcelaId) {
      setParcelaSelecionada('');
    }
  };
  
  // Salvar como novo modelo
  const salvarComoModelo = async () => {
    if (!nomeNovoModelo || !mensagem) return;
    
    setSalvandoModelo(true);
    try {
      await comunicacaoService.salvarModeloMensagem({
        nome: nomeNovoModelo,
        tipo: tipoCobranca,
        conteudo: mensagem
      });
      
      // Recarregar modelos
      const response = await comunicacaoService.obterModelosMensagens(tipoCobranca);
      setModelosMensagem(response.data || []);
      
      setNomeNovoModelo('');
      setResultado({
        tipo: 'success',
        mensagem: 'Modelo salvo com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao salvar modelo:', error);
      setResultado({
        tipo: 'error',
        mensagem: 'Erro ao salvar modelo. Tente novamente.'
      });
    } finally {
      setSalvandoModelo(false);
    }
  };
  
  // Enviar comunicação
  const enviarComunicacao = async () => {
    if (!clienteSelecionado || !mensagem) {
      setResultado({
        tipo: 'error',
        mensagem: 'Por favor, selecione um cliente e digite uma mensagem.'
      });
      return;
    }
    
    setLoading(true);
    setResultado(null);
    
    try {
      const resultado = await enviarComunicacaoManual(
        clienteSelecionado,
        tipoCobranca,
        mensagem,
        anexos,
        parcelaSelecionada // Pode ser vazio
      );
      
      setResultado({
        tipo: resultado.sucesso ? 'success' : 'error',
        mensagem: resultado.mensagem
      });
      
      if (resultado.sucesso) {
        limparFormulario();
      }
    } catch (error) {
      console.error('Erro ao enviar comunicação:', error);
      setResultado({
        tipo: 'error',
        mensagem: 'Erro ao enviar comunicação. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Envio Manual de Cobrança
      </Typography>
      
      {resultado && (
        <Alert 
          severity={resultado.tipo} 
          sx={{ mb: 2 }}
          onClose={() => setResultado(null)}
        >
          {resultado.mensagem}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        {/* Coluna esquerda */}
        <Grid item xs={12} md={8}>
          {/* Seleção de cliente e parcela */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Destinatário
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Cliente</InputLabel>
                    <Select
                      value={clienteSelecionado}
                      label="Cliente"
                      onChange={handleClienteChange}
                      disabled={carregandoClientes || !!clienteId}
                    >
                      <MenuItem value="">
                        <em>Selecione um cliente</em>
                      </MenuItem>
                      {clientes.map((cliente) => (
                        <MenuItem key={cliente.id} value={cliente.id}>
                          {cliente.nome} ({cliente.documento})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Parcela (Opcional)</InputLabel>
                    <Select
                      value={parcelaSelecionada}
                      label="Parcela (Opcional)"
                      onChange={handleParcelaChange}
                      disabled={carregandoParcelas || !clienteSelecionado || !!parcelaId}
                    >
                      <MenuItem value="">
                        <em>Todas as parcelas</em>
                      </MenuItem>
                      {parcelas.map((parcela) => (
                        <MenuItem key={parcela.id} value={parcela.id}>
                          Parcela {parcela.numero} - {parcela.diasAtraso} dias em atraso
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Tipo de comunicação e mensagem */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Mensagem
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
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
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Modelo de Mensagem</InputLabel>
                      <Select
                        value={modeloSelecionado}
                        label="Modelo de Mensagem"
                        onChange={handleModeloChange}
                        disabled={carregandoModelos}
                      >
                        <MenuItem value="">
                          <em>Sem modelo</em>
                        </MenuItem>
                        {modelosMensagem.map((modelo) => (
                          <MenuItem key={modelo.id} value={modelo.id}>
                            {modelo.nome}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
              
              <TextField
                label="Mensagem"
                multiline
                rows={6}
                fullWidth
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Digite a mensagem a ser enviada..."
                variant="outlined"
                size="small"
              />
              
              {/* Anexos (apenas para e-mail) */}
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
                      size="small"
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
            </CardContent>
          </Card>
          
          {/* Botões de ação */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={limparFormulario}
              disabled={loading}
            >
              Limpar
            </Button>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={() => navigator.clipboard.writeText(mensagem)}
                disabled={!mensagem}
              >
                Copiar
              </Button>
              
              <Button
                variant="contained"
                startIcon={
                  tipoCobranca === 'email' ? <Email /> :
                  tipoCobranca === 'whatsapp' ? <WhatsApp /> :
                  <Sms />
                }
                onClick={enviarComunicacao}
                disabled={!clienteSelecionado || !mensagem || loading}
                color="primary"
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                    Enviando...
                  </>
                ) : (
                  'Enviar'
                )}
              </Button>
            </Box>
          </Box>
        </Grid>
        
        {/* Coluna direita */}
        <Grid item xs={12} md={4}>
          {/* Salvar como modelo */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Salvar como Modelo
              </Typography>
              
              <TextField
                label="Nome do Modelo"
                fullWidth
                value={nomeNovoModelo}
                onChange={(e) => setNomeNovoModelo(e.target.value)}
                margin="normal"
                size="small"
                disabled={!mensagem || salvandoModelo}
              />
              
              <Button
                variant="outlined"
                startIcon={<Save />}
                fullWidth
                sx={{ mt: 1 }}
                onClick={salvarComoModelo}
                disabled={!nomeNovoModelo || !mensagem || salvandoModelo}
              >
                {salvandoModelo ? 'Salvando...' : 'Salvar Modelo'}
              </Button>
            </CardContent>
          </Card>
          
          {/* Dicas */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Dicas
              </Typography>
              
              <Typography variant="body2" paragraph>
                • Use <strong>{'{nome}'}</strong> para inserir o nome do cliente
              </Typography>
              
              <Typography variant="body2" paragraph>
                • Use <strong>{'{parcela}'}</strong> para inserir o número da parcela
              </Typography>
              
              <Typography variant="body2" paragraph>
                • Use <strong>{'{valor}'}</strong> para inserir o valor da parcela
              </Typography>
              
              <Typography variant="body2" paragraph>
                • Use <strong>{'{vencimento}'}</strong> para inserir a data de vencimento
              </Typography>
              
              <Typography variant="body2" paragraph>
                • Use <strong>{'{diasAtraso}'}</strong> para inserir os dias em atraso
              </Typography>
              
              <Typography variant="body2">
                • Use <strong>{'{link}'}</strong> para inserir o link para pagamento
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EnvioManualCobranca;