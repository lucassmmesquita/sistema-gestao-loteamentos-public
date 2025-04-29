// src/pages/contratos/VisualizarContrato.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, 
  Typography, 
  Paper, 
  Button, 
  Tabs, 
  Tab, 
  Alert,
  Grid,
  Dialog,
  Divider,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  CloudDownload as DownloadIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import useContratos from '../../hooks/useContratos';
import useParcelas from '../../hooks/useParcelas';
import useClientes from '../../hooks/useClientes';
import useLotes from '../../hooks/useLotes';
import useAuth from '../../hooks/useAuth';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import ParcelasContrato from '../../components/parcelas/ParcelasContrato';
import DocumentosContrato from '../../components/documentos/DocumentosContrato';
import ContratoPreview from '../../components/contratos/ContratoPreview';
import FluxoAprovacao from '../../components/contratos/FluxoAprovacao';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`contrato-tabpanel-${index}`}
      aria-labelledby={`contrato-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const getEstadoChipProps = (estado) => {
  switch (estado) {
    case 'pre_contrato':
      return { label: 'Pré-Contrato', color: 'default' };
    case 'em_aprovacao':
      return { label: 'Em Aprovação', color: 'warning' };
    case 'aprovado':
      return { label: 'Aprovado', color: 'info' };
    case 'oficializado':
      return { label: 'Oficializado', color: 'success' };
    default:
      return { label: 'Desconhecido', color: 'default' };
  }
};

const VisualizarContrato = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadContrato, currentContrato, loading, error, gerarPreviaContrato } = useContratos();
  const { loadParcelasByContrato, gerarParcelasDeContrato, loading: loadingParcelas } = useParcelas();
  const { loadCliente } = useClientes();
  const { loadLote } = useLotes();
  const { canEditContrato } = useAuth();
  
  const [loaded, setLoaded] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [parcelas, setParcelas] = useState([]);
  const [clienteNome, setClienteNome] = useState('');
  const [loteInfo, setLoteInfo] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [parcelasGeradas, setParcelasGeradas] = useState(false);

  useEffect(() => {
    const fetchContrato = async () => {
      if (id) {
        await loadContrato(parseInt(id));
        setLoaded(true);
      }
    };

    fetchContrato();
  }, [id, loadContrato]);

  useEffect(() => {
    const fetchParcelas = async () => {
      if (id) {
        const parcelasContrato = await loadParcelasByContrato(parseInt(id));
        setParcelas(parcelasContrato);
        setParcelasGeradas(parcelasContrato.length > 0);
      }
    };

    fetchParcelas();
  }, [id, loadParcelasByContrato]);

  useEffect(() => {
    const fetchDetalhes = async () => {
      if (currentContrato) {
        // Busca detalhes do cliente
        try {
          const cliente = await loadCliente(currentContrato.clienteId);
          if (cliente) {
            setClienteNome(cliente.nome);
          }
        } catch (error) {
          console.error('Erro ao carregar cliente:', error);
        }

        // Busca detalhes do lote
        try {
          const lote = await loadLote(currentContrato.loteId);
          if (lote) {
            setLoteInfo(`${lote.loteamento} - Quadra ${lote.quadra}, Lote ${lote.numero} (${lote.area} m²)`);
          }
        } catch (error) {
          console.error('Erro ao carregar lote:', error);
        }
      }
    };

    fetchDetalhes();
  }, [currentContrato, loadCliente, loadLote]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleVisualizarContrato = async () => {
    if (currentContrato) {
      try {
        const previa = await gerarPreviaContrato(currentContrato);
        setPreviewContent(previa);
        setPreviewOpen(true);
      } catch (error) {
        console.error('Erro ao gerar prévia do contrato:', error);
      }
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handleGerarParcelas = async () => {
    if (currentContrato && !parcelasGeradas) {
      try {
        const parcelasGeradas = await gerarParcelasDeContrato(currentContrato.id);
        if (parcelasGeradas) {
          setParcelas(parcelasGeradas);
          setParcelasGeradas(true);
        }
      } catch (error) {
        console.error('Erro ao gerar parcelas:', error);
      }
    }
  };

  const isContratoEditavel = currentContrato && canEditContrato(currentContrato);

  return (
    <Box>
      <Loading open={loading || loadingParcelas || !loaded} />

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/contratos')}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}
        >
          Dados do Contrato
        </Typography>
        
        {!isContratoEditavel && currentContrato?.estado === 'oficializado' && (
          <Chip 
            label="Blindado" 
            color="error"
            variant="outlined"
            size="small"
            sx={{ ml: 2 }}
          />
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loaded && !currentContrato && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Contrato não encontrado. Verifique se o ID está correto.
        </Alert>
      )}

      {loaded && currentContrato && (
        <>
          <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h5" sx={{ mr: 2 }}>
                      Contrato #{currentContrato.id}
                    </Typography>
                    {currentContrato.estado && (
                      <Chip
                        label={getEstadoChipProps(currentContrato.estado).label}
                        color={getEstadoChipProps(currentContrato.estado).color}
                        size="small"
                      />
                    )}
                  </Box>
                  <Typography color="text.secondary">
                    {clienteNome} - {loteInfo}
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title="Visualizar Contrato">
                    <IconButton onClick={handleVisualizarContrato}>
                      <DescriptionIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Informações Gerais" />
                <Tab label="Parcelas" />
                <Tab label="Documentos" />
                <Tab label="Fluxo de Aprovação" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        Dados do Contrato
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Cliente
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {clienteNome}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Lote
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {loteInfo}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Data de Início
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {formatDate(currentContrato.dataInicio)}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Data de Fim
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {formatDate(currentContrato.dataFim)}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Status
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {currentContrato.status || 'Ativo'}
                          </Typography>
                        </Grid>
                        
                        {currentContrato.numeroContrato && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Número do Contrato
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {currentContrato.numeroContrato}
                            </Typography>
                          </Grid>
                        )}
                        
                        {currentContrato.dataEmissao && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Data de Emissão
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {formatDate(currentContrato.dataEmissao)}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        Valores
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Valor Total
                          </Typography>
                          <Typography variant="body1" fontWeight="bold" gutterBottom>
                            {formatCurrency(currentContrato.valorTotal)}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Valor da Entrada
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {formatCurrency(currentContrato.valorEntrada)}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Valor Financiado
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {formatCurrency(currentContrato.valorTotal - currentContrato.valorEntrada)}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Número de Parcelas
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {currentContrato.numeroParcelas}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Valor da Parcela
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {currentContrato.valorPrestacao 
                              ? formatCurrency(currentContrato.valorPrestacao)
                              : formatCurrency((currentContrato.valorTotal - currentContrato.valorEntrada) / currentContrato.numeroParcelas)}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Dia de Vencimento
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Dia {currentContrato.dataVencimento}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Cláusulas Contratuais
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {currentContrato.clausulas}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                {parcelasGeradas ? (
                  <ParcelasContrato parcelas={parcelas} contratoId={currentContrato.id} />
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Parcelas não geradas
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Este contrato ainda não possui parcelas geradas.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={handleGerarParcelas}
                      disabled={currentContrato.estado === 'oficializado' ? false : !isContratoEditavel}
                    >
                      Gerar Parcelas Automaticamente
                    </Button>
                  </Box>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <DocumentosContrato contratoId={currentContrato.id} />
              </TabPanel>
              
              <TabPanel value={tabValue} index={3}>
                <FluxoAprovacao contrato={currentContrato} />
              </TabPanel>
            </CardContent>
          </Card>

          {/* Modal de prévia do contrato */}
          <Dialog
            open={previewOpen}
            onClose={handleClosePreview}
            maxWidth="md"
            fullWidth
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Prévia do Contrato
              </Typography>
              <ContratoPreview conteudo={previewContent} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={handleClosePreview}>
                  Fechar
                </Button>
              </Box>
            </Box>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default VisualizarContrato;