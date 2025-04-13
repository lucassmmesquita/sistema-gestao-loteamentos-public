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
  Tooltip,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  FileUpload as UploadIcon,
  CloudUpload as CloudUploadIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useBoletos from '../../hooks/useBoletos';
import { formatFileSize, detectFileType } from '../../utils/fileUtils';
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
        accept=".xlsx,.xls,.csv"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
      <Typography variant="h6" gutterBottom>
        Arraste e solte a planilha de pagamentos aqui
      </Typography>
      <Typography variant="body2" color="textSecondary">
        ou clique para selecionar o arquivo
      </Typography>
      <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 1 }}>
        Formatos aceitos: Excel (.xlsx, .xls) ou CSV (.csv)
      </Typography>
    </Paper>
  );
};

const ImportarPagamentos = () => {
  const { importarPagamentos, gerarModeloImportacao, loadBoletos, loading } = useBoletos();
  
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
  const [activeStep, setActiveStep] = useState(0);
  const [fileType, setFileType] = useState(null);
  
  // Passos do processo
  const steps = ['Selecionar Arquivo', 'Validar Dados', 'Processar Pagamentos'];
  
  // Manipulador para seleção de arquivo
  const handleFileSelect = async (file) => {
    // Detecta o tipo de arquivo
    try {
      const type = await detectFileType(file);
      
      if (type === 'unknown') {
        setNotification({
          open: true,
          message: 'Formato de arquivo não reconhecido. Por favor, use Excel (.xlsx, .xls) ou CSV (.csv)',
          severity: 'error'
        });
        return;
      }
      
      setFileType(type);
      setSelectedFile(file);
      setActiveStep(1);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Erro ao verificar o arquivo: ' + error.message,
        severity: 'error'
      });
    }
  };
  
  // Limpa o arquivo selecionado
  const handleClearFile = () => {
    setSelectedFile(null);
    setFileType(null);
    setActiveStep(0);
  };
  
  // Processa a planilha de pagamentos
  const handleProcessFile = async () => {
    if (!selectedFile) return;
    
    setProcessLoading(true);
    setActiveStep(2);
    
    try {
      const resultado = await importarPagamentos(selectedFile);
      
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
        message: 'Erro ao processar arquivo: ' + error.message,
        severity: 'error'
      });
      setActiveStep(1);
    } finally {
      setProcessLoading(false);
    }
  };
  
  // Manipulador para mudança de tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Download do modelo de importação
  const handleDownloadModelo = async () => {
    try {
      const blob = await gerarModeloImportacao();
      
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'modelo_importacao_pagamentos.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Erro ao gerar modelo de importação: ' + error.message,
        severity: 'error'
      });
    }
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
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  // Renderiza o conteúdo com base no passo atual
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <UploadArea onFileSelect={handleFileSelect} />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadModelo}
              >
                Baixar Modelo de Importação
              </Button>
            </Box>
          </>
        );
      case 1:
        return (
          <>
            <Paper sx={{ p: 3, my: 3 }} variant="outlined">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle1">
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formatFileSize(selectedFile.size)} • {fileType === 'csv' ? 'CSV' : 'Excel'} • Selecionado em {format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
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
            
            <Paper sx={{ p: 3, my: 3 }} variant="outlined">
              <Typography variant="subtitle1" gutterBottom>
                Validação Prévia do Arquivo
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Formato do arquivo válido: {fileType === 'csv' ? 'CSV' : 'Excel'}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="textSecondary" paragraph>
                Antes de continuar, certifique-se de que:
              </Typography>
              
              <ul>
                <li>O arquivo segue o modelo disponibilizado</li>
                <li>A primeira linha contém os cabeçalhos</li>
                <li>A coluna <strong>nossoNumero</strong> está preenchida corretamente</li>
                <li>A coluna <strong>valorPago</strong> contém apenas valores numéricos</li>
                <li>A coluna <strong>dataPagamento</strong> está no formato AAAA-MM-DD</li>
              </ul>
              
              <Typography variant="body2" sx={{ mt: 2 }}>
                Clique em <strong>Processar</strong> para continuar com a importação.
              </Typography>
            </Paper>
          </>
        );
      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              Processando Arquivo...
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Por favor, aguarde enquanto processamos os dados. Isso pode levar alguns instantes.
            </Typography>
          </Box>
        );
      default:
        return 'Passo desconhecido';
    }
  };
  
  return (
    <>
      <Loading open={loading && !processLoading} />
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h1">
              Importação de Pagamentos
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" paragraph>
              Importe pagamentos em lote através de um arquivo Excel ou CSV. O sistema irá processar os registros e atualizar automaticamente o status dos boletos correspondentes.
            </Typography>
          </Box>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {getStepContent(activeStep)}
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" paragraph>
              Instruções para Importação de Pagamentos:
            </Typography>
            
            <Typography component="div" variant="body2">
              <ol>
                <li>Baixe o modelo de importação clicando no botão "Baixar Modelo de Importação".</li>
                <li>Preencha o arquivo com os dados dos pagamentos realizados.</li>
                <li>A coluna <strong>nossoNumero</strong> é obrigatória e deve corresponder ao número do boleto.</li>
                <li>Faça o upload do arquivo preenchido.</li>
                <li>Clique em "Processar" e aguarde a conclusão do processamento.</li>
                <li>O sistema irá atualizar o status dos boletos e registrar os pagamentos.</li>
              </ol>
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      {/* Diálogo de resultado */}
      <Dialog
        open={resultDialog.open}
        onClose={() => setResultDialog({ open: false, data: null })}
        aria-labelledby="importacao-result-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="importacao-result-dialog-title">
          Resultado da Importação
        </DialogTitle>
        <DialogContent>
          {resultDialog.data && (
            <>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                      <Typography variant="body1">
                        Pagamentos registrados: <strong>{resultDialog.data.sucesso.length}</strong>
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ErrorIcon sx={{ color: 'error.main', mr: 1 }} />
                      <Typography variant="body1">
                        Registros com erro: <strong>{resultDialog.data.falha.length}</strong>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Sucesso
                        <Chip 
                          label={resultDialog.data.sucesso.length} 
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
                        Erros
                        <Chip 
                          label={resultDialog.data.falha.length} 
                          size="small" 
                          color="error" 
                          sx={{ ml: 1 }} 
                        />
                      </Box>
                    } 
                  />
                </Tabs>
              </Box>
              
              {tabValue === 0 && resultDialog.data.sucesso.length > 0 && (
                <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Nosso Número</TableCell>
                        <TableCell>Data Pagamento</TableCell>
                        <TableCell align="right">Valor Pago</TableCell>
                        <TableCell>Forma de Pagamento</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {resultDialog.data.sucesso.map((pagamento, index) => (
                        <TableRow key={index}>
                          <TableCell>{pagamento.nossoNumero}</TableCell>
                          <TableCell>{formatDate(pagamento.dataPagamento)}</TableCell>
                          <TableCell align="right">{formatCurrency(pagamento.valorPago)}</TableCell>
                          <TableCell>{pagamento.formaPagamento || 'importacao'}</TableCell>
                          <TableCell><StatusBoleto status="pago" /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {tabValue === 1 && resultDialog.data.falha.length > 0 && (
                <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Nosso Número</TableCell>
                        <TableCell>Erro</TableCell>
                        <TableCell>Data Pagamento</TableCell>
                        <TableCell align="right">Valor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {resultDialog.data.falha.map((erro, index) => (
                        <TableRow key={index}>
                          <TableCell>{erro.nossoNumero || '-'}</TableCell>
                          <TableCell sx={{ color: 'error.main' }}>{erro.erro}</TableCell>
                          <TableCell>{formatDate(erro.dataPagamento) || '-'}</TableCell>
                          <TableCell align="right">{erro.valorPago ? formatCurrency(erro.valorPago) : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {tabValue === 0 && resultDialog.data.sucesso.length === 0 && (
                <Typography variant="body1" sx={{ py: 2, textAlign: 'center' }}>
                  Nenhum pagamento foi registrado com sucesso.
                </Typography>
              )}
              
              {tabValue === 1 && resultDialog.data.falha.length === 0 && (
                <Typography variant="body1" sx={{ py: 2, textAlign: 'center' }}>
                  Nenhum erro foi encontrado durante a importação.
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setResultDialog({ open: false, data: null });
              setActiveStep(0);
              setSelectedFile(null);
              setFileType(null);
            }}
            startIcon={<RefreshIcon />}
          >
            Importar Outro Arquivo
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

export default ImportarPagamentos;