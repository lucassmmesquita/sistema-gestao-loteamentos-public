import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  FileUpload as UploadIcon,
  CloudUpload as CloudUploadIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  VisibilityOff as HideIcon,
  Visibility as ShowIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useBoletos from '../../hooks/useBoletos';
import { formatFileSize } from '../../utils/fileUtils';
import Loading from '../common/Loading';
import StatusBoleto from './StatusBoleto';

// Componente para área de upload de arquivo
const UploadArea = ({ onFileSelect }) => {
  const fileInputRef = useRef();
  const [dragActive, setDragActive] = useState(false);
  
  // Manipula o evento de drag
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Manipula o evento de drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  // Manipula a seleção de arquivo via input
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };
  
  // Abre o seletor de arquivos
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        border: '2px dashed',
        borderColor: dragActive ? 'primary.main' : 'divider',
        bgcolor: dragActive ? 'action.hover' : 'background.paper',
        borderRadius: 2,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        my: 3
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={openFileSelector}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".ret"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
      <Typography variant="h6" gutterBottom>
        Arraste e solte o arquivo de retorno aqui
      </Typography>
      <Typography variant="body2" color="textSecondary">
        ou clique para selecionar o arquivo
      </Typography>
      <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 1 }}>
        Formatos aceitos: arquivo de retorno CNAB 240
      </Typography>
    </Paper>
  );
};

const ArquivoRetorno = () => {
  const { processarArquivoRetorno, loadBoletos, loading } = useBoletos();
  
  // Estados
  const [selectedFile, setSelectedFile] = useState(null);
  const [processLoading, setProcessLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [resultDialog, setResultDialog] = useState({
    open: false,
    data: null
  });
  const [tabValue, setTabValue] = useState(0);
  const [showRawData, setShowRawData] = useState(false);
  
  // Manipulador para seleção de arquivo
  const handleFileSelect = (file) => {
    // Verifica extensão do arquivo
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (fileExt !== 'ret') {
      setNotification({
        open: true,
        message: 'Formato de arquivo inválido. Por favor, selecione um arquivo de retorno (.ret)',
        severity: 'error'
      });
      return;
    }
    
    setSelectedFile(file);
  };
  
  // Limpa o arquivo selecionado
  const handleClearFile = () => {
    setSelectedFile(null);
  };
  
  // Processa o arquivo de retorno
  const handleProcessFile = async () => {
    if (!selectedFile) return;
    
    setProcessLoading(true);
    
    try {
      const resultado = await processarArquivoRetorno(selectedFile);
      
      if (resultado) {
        // Abre diálogo com os resultados
        setResultDialog({
          open: true,
          data: resultado
        });
        
        // Recarrega a lista de boletos para refletir as alterações
        loadBoletos();
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Erro ao processar arquivo de retorno: ' + error.message,
        severity: 'error'
      });
    } finally {
      setProcessLoading(false);
    }
  };
  
  // Manipulador para mudança de tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Formata valor como moeda
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Formata data
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };
  
  return (
    <>
      <Loading open={loading || processLoading} />
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h1">
              Processamento de Arquivo de Retorno
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" paragraph>
              Faça o upload do arquivo de retorno enviado pela Caixa Econômica Federal para atualizar o status dos boletos. 
              O sistema irá processar o arquivo e atualizar automaticamente os boletos na base de dados.
            </Typography>
          </Box>
          
          {!selectedFile ? (
            <UploadArea onFileSelect={handleFileSelect} />
          ) : (
            <Paper sx={{ p: 3, my: 3 }} variant="outlined">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle1">
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formatFileSize(selectedFile.size)} • Selecionado em {format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={handleClearFile}
                  >
                    Remover
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<UploadIcon />}
                    onClick={handleProcessFile}
                    disabled={processLoading}
                  >
                    Processar
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" paragraph>
              Instruções para Processamento de Arquivo de Retorno:
            </Typography>
            
            <Typography component="div" variant="body2">
              <ol>
                <li>Obtenha o arquivo de retorno no sistema da Caixa Econômica Federal.</li>
                <li>O arquivo deve estar no formato CNAB 240 e ter a extensão <strong>.ret</strong>.</li>
                <li>Faça o upload do arquivo na área acima ou arraste e solte o arquivo.</li>
                <li>Clique em "Processar" e aguarde o processamento do arquivo.</li>
                <li>O sistema irá atualizar automaticamente o status dos boletos na base de dados.</li>
                <li>Um relatório será exibido com os boletos processados e seus novos status.</li>
              </ol>
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      {/* Diálogo de resultado */}
      <Dialog
        open={resultDialog.open}
        onClose={() => setResultDialog({ open: false, data: null })}
        aria-labelledby="retorno-result-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="retorno-result-dialog-title">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Resultado do Processamento
            </Typography>
            <Box>
              <Tooltip title={showRawData ? "Ocultar dados brutos" : "Mostrar dados brutos"}>
                <IconButton size="small" onClick={() => setShowRawData(!showRawData)}>
                  {showRawData ? <HideIcon /> : <ShowIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {resultDialog.data && (
            <>
              <Box sx={{ mb: 3 }}>
                <Paper sx={{ p: 2 }} variant="outlined">
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Protocolo:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {resultDialog.data.protocolo}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Data de Processamento:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {formatDate(resultDialog.data.dataProcessamento)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">
                        Total de Registros:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {resultDialog.data.quantidadeRegistros}
                      </Typography>
                    </Grid>
                    {showRawData && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          Linhas no Arquivo:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {resultDialog.data.linhasArquivo}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Box>
              
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Todos" />
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Pagos
                        <Chip 
                          label={resultDialog.data.registrosProcessados.filter(r => r.status === 'pago').length} 
                          size="small" 
                          color="success" 
                          sx={{ ml: 1 }} 
                        />
                      </Box>
                    } 
                  />
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Vencidos
                        <Chip 
                          label={resultDialog.data.registrosProcessados.filter(r => r.status === 'vencido').length} 
                          size="small" 
                          color="warning" 
                          sx={{ ml: 1 }} 
                        />
                      </Box>
                    } 
                  />
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Cancelados
                        <Chip 
                          label={resultDialog.data.registrosProcessados.filter(r => r.status === 'cancelado').length} 
                          size="small" 
                          color="error" 
                          sx={{ ml: 1 }} 
                        />
                      </Box>
                    } 
                  />
                </Tabs>
              </Box>
              
              <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nosso Número</TableCell>
                      <TableCell>Status</TableCell>
                      {tabValue === 1 && (
                        <>
                          <TableCell>Data Pagamento</TableCell>
                          <TableCell align="right">Valor Pago</TableCell>
                        </>
                      )}
                      {tabValue === 0 && (
                        <>
                          <TableCell>Data</TableCell>
                          <TableCell align="right">Valor</TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resultDialog.data.registrosProcessados
                      .filter(registro => {
                        if (tabValue === 0) return true;
                        if (tabValue === 1) return registro.status === 'pago';
                        if (tabValue === 2) return registro.status === 'vencido';
                        if (tabValue === 3) return registro.status === 'cancelado';
                        return true;
                      })
                      .map((registro, index) => (
                        <TableRow key={index}>
                          <TableCell>{registro.nossoNumero}</TableCell>
                          <TableCell><StatusBoleto status={registro.status} /></TableCell>
                          {tabValue === 1 ? (
                            <>
                              <TableCell>{formatDate(registro.dataPagamento)}</TableCell>
                              <TableCell align="right">{formatCurrency(registro.valorPago)}</TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>
                                {registro.dataPagamento 
                                  ? formatDate(registro.dataPagamento) 
                                  : '-'}
                              </TableCell>
                              <TableCell align="right">
                                {registro.valorPago 
                                  ? formatCurrency(registro.valorPago) 
                                  : '-'}
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {resultDialog.data.resultadoAtualizacao && (
                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        Boletos atualizados com sucesso:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                        {resultDialog.data.resultadoAtualizacao.sucesso.length}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        Boletos com erro de atualização:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                        <ErrorIcon sx={{ color: 'error.main', mr: 1 }} />
                        {resultDialog.data.resultadoAtualizacao.falha.length}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setResultDialog({ open: false, data: null })}
            startIcon={<RefreshIcon />}
          >
            Processar Outro Arquivo
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default ArquivoRetorno;