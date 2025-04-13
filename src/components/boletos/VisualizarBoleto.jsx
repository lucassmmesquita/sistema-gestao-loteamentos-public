import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Paper,
  Chip,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  ContentCopy as CopyIcon,
  Print as PrintIcon,
  GetApp as DownloadIcon,
  Payment as PaymentIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useBoletos from '../../hooks/useBoletos';
import StatusBoleto from './StatusBoleto';
import Loading from '../common/Loading';

const VisualizarBoleto = ({ boleto }) => {
  const { registrarPagamento, cancelarBoleto, loading } = useBoletos();
  
  // Estados
  const [paymentDialog, setPaymentDialog] = useState({ open: false });
  const [cancelDialog, setCancelDialog] = useState({ open: false });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Pagamento manual
  const [paymentData, setPaymentData] = useState({
    dataPagamento: format(new Date(), 'yyyy-MM-dd'),
    valorPago: '',
    formaPagamento: 'manual'
  });
  
  // Manipuladores para o diálogo de pagamento
  const handleOpenPaymentDialog = () => {
    setPaymentData({
      dataPagamento: format(new Date(), 'yyyy-MM-dd'),
      valorPago: boleto.valor,
      formaPagamento: 'manual'
    });
    setPaymentDialog({ open: true });
  };
  
  const handleClosePaymentDialog = () => {
    setPaymentDialog({ open: false });
  };
  
  const handlePaymentDataChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleConfirmPayment = async () => {
    try {
      await registrarPagamento(boleto.id, paymentData);
      
      setNotification({
        open: true,
        message: 'Pagamento registrado com sucesso!',
        severity: 'success'
      });
      
      handleClosePaymentDialog();
    } catch (error) {
      setNotification({
        open: true,
        message: 'Erro ao registrar pagamento: ' + error.message,
        severity: 'error'
      });
    }
  };
  
  // Manipuladores para o diálogo de cancelamento
  const handleOpenCancelDialog = () => {
    setCancelDialog({ open: true });
  };
  
  const handleCloseCancelDialog = () => {
    setCancelDialog({ open: false });
  };
  
  const handleConfirmCancel = async () => {
    try {
      await cancelarBoleto(boleto.id);
      
      setNotification({
        open: true,
        message: 'Boleto cancelado com sucesso!',
        severity: 'success'
      });
      
      handleCloseCancelDialog();
    } catch (error) {
      setNotification({
        open: true,
        message: 'Erro ao cancelar boleto: ' + error.message,
        severity: 'error'
      });
    }
  };
  
  // Manipulador para copiar para a área de transferência
  const handleCopy = (text, message) => {
    navigator.clipboard.writeText(text);
    
    setNotification({
      open: true,
      message: message || 'Copiado para a área de transferência!',
      severity: 'info'
    });
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
  
  // Se não houver boleto, não renderiza nada
  if (!boleto) return null;
  
  return (
    <>
      <Loading open={loading} />
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ReceiptIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
              <Typography variant="h5" component="h1">
                Boleto #{boleto.id}
              </Typography>
            </Box>
            
            <Box>
              <StatusBoleto status={boleto.status} />
            </Box>
          </Box>
          
          <Divider sx={{ mb: 4 }} />
          
          {/* Informações do boleto */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Dados do Boleto
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Nosso Número:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight="medium">
                        {boleto.nossoNumero}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopy(boleto.nossoNumero, 'Nosso Número copiado!')}
                        sx={{ ml: 1 }}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Valor:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatCurrency(boleto.valor)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Vencimento:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(boleto.dataVencimento)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Data de Emissão:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(boleto.dataGeracao)}
                    </Typography>
                  </Grid>
                  
                  {boleto.status === 'pago' && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Data de Pagamento:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatDate(boleto.dataPagamento)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          Valor Pago:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatCurrency(boleto.valorPago)}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Descrição:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {boleto.descricao}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Dados do Cliente
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Nome:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      <Link component={RouterLink} to={`/clientes/${boleto.clienteId}`}>
                        {boleto.clienteNome}
                      </Link>
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Contrato:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      <Link component={RouterLink} to={`/contratos/${boleto.contratoId}`}>
                        Contrato #{boleto.contratoId}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              {/* Código de barras */}
              {boleto.linhaDigitavel && (
                <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Linha Digitável
                  </Typography>
                  
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'background.paper', 
                    borderRadius: 1,
                    border: '1px dashed',
                    borderColor: 'divider',
                    position: 'relative'
                  }}>
                    <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
                      {boleto.linhaDigitavel}
                    </Typography>
                    
                    <Tooltip title="Copiar Linha Digitável">
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopy(boleto.linhaDigitavel, 'Linha Digitável copiada!')}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              )}
              
              {/* Ações de boleto */}
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {boleto.pdfUrl && (
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    component="a"
                    href={boleto.pdfUrl}
                    target="_blank"
                    fullWidth
                  >
                    Download do Boleto
                  </Button>
                )}
                
                {boleto.status === 'gerado' && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PaymentIcon />}
                      onClick={handleOpenPaymentDialog}
                      fullWidth
                    >
                      Registrar Pagamento
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={handleOpenCancelDialog}
                      fullWidth
                    >
                      Cancelar Boleto
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
          
          {/* Botão voltar */}
          <Box sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              component={RouterLink}
              to="/boletos"
            >
              Voltar para Lista de Boletos
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {/* Diálogo para registrar pagamento */}
      <Dialog
        open={paymentDialog.open}
        onClose={handleClosePaymentDialog}
      >
        <DialogTitle>Registrar Pagamento</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Informe os dados do pagamento:
          </DialogContentText>
          
          <TextField
            label="Data do Pagamento"
            type="date"
            fullWidth
            margin="normal"
            value={paymentData.dataPagamento}
            onChange={(e) => handlePaymentDataChange('dataPagamento', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            label="Valor Pago"
            type="number"
            fullWidth
            margin="normal"
            value={paymentData.valorPago}
            onChange={(e) => handlePaymentDataChange('valorPago', e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
            }}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Forma de Pagamento</InputLabel>
            <Select
              value={paymentData.formaPagamento}
              label="Forma de Pagamento"
              onChange={(e) => handlePaymentDataChange('formaPagamento', e.target.value)}
            >
              <MenuItem value="manual">Registro Manual</MenuItem>
              <MenuItem value="dinheiro">Dinheiro</MenuItem>
              <MenuItem value="pix">PIX</MenuItem>
              <MenuItem value="transferencia">Transferência</MenuItem>
              <MenuItem value="cartao">Cartão</MenuItem>
              <MenuItem value="cheque">Cheque</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cancelar</Button>
          <Button 
            onClick={handleConfirmPayment} 
            color="primary" 
            variant="contained"
          >
            Registrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de confirmação de cancelamento */}
      <Dialog
        open={cancelDialog.open}
        onClose={handleCloseCancelDialog}
      >
        <DialogTitle>Cancelar Boleto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja cancelar este boleto? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>Não</Button>
          <Button onClick={handleConfirmCancel} color="error" autoFocus>
            Sim, Cancelar
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

export default VisualizarBoleto;