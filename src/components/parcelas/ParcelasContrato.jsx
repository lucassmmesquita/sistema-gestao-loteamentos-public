// src/components/parcelas/ParcelasContrato.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  InputAdornment,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  CalendarMonth as CalendarIcon,
  Payment as PaymentIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { formatCurrency, formatDate } from '../../utils/formatters';
import useParcelas from '../../hooks/useParcelas';

const ParcelasContrato = ({ parcelas: parcelasIniciais, contratoId }) => {
  const { registrarPagamento, loading, error } = useParcelas();
  
  // Estados locais
  const [parcelas, setParcelas] = useState([]);
  const [paymentDialog, setPaymentDialog] = useState({ 
    open: false, 
    parcelaId: null,
    parcelaNumero: null,
    valorOriginal: 0
  });
  const [paymentData, setPaymentData] = useState({
    dataPagamento: new Date().toISOString().split('T')[0],
    valorPago: '',
    formaPagamento: 'dinheiro',
    observacoes: ''
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Inicializa as parcelas
  useEffect(() => {
    if (parcelasIniciais && parcelasIniciais.length > 0) {
      // Organiza as parcelas por número (ordem crescente)
      const parcelasOrdenadas = [...parcelasIniciais].sort((a, b) => a.numero - b.numero);
      setParcelas(parcelasOrdenadas);
    }
  }, [parcelasIniciais]);
  
  // Define a cor do status da parcela
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paga':
        return 'success';
      case 'atrasada':
        return 'error';
      case 'vencendo':
        return 'warning';
      case 'futura':
      default:
        return 'default';
    }
  };
  
  // Define o status da parcela com base na data de vencimento e pagamento
  const getParcelaStatus = (parcela) => {
    if (parcela.dataPagamento) {
      return 'paga';
    }
    
    const hoje = new Date();
    const dataVencimento = new Date(parcela.dataVencimento);
    
    if (dataVencimento < hoje) {
      return 'atrasada';
    }
    
    // Considera "vencendo" se estiver a 7 dias do vencimento
    const diasParaVencimento = Math.floor((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
    if (diasParaVencimento <= 7) {
      return 'vencendo';
    }
    
    return 'futura';
  };
  
  // Manipuladores para o diálogo de pagamento
  const handleOpenPaymentDialog = (parcela) => {
    setPaymentDialog({ 
      open: true, 
      parcelaId: parcela.id,
      parcelaNumero: parcela.numero,
      valorOriginal: parcela.valor
    });
    
    setPaymentData({
      dataPagamento: new Date().toISOString().split('T')[0],
      valorPago: parcela.valor,
      formaPagamento: 'dinheiro',
      observacoes: ''
    });
  };
  
  const handleClosePaymentDialog = () => {
    setPaymentDialog({ open: false, parcelaId: null, parcelaNumero: null, valorOriginal: 0 });
  };
  
  const handlePaymentDataChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleConfirmPayment = async () => {
    if (!paymentDialog.parcelaId) return;
    
    try {
      const parcelaPaga = await registrarPagamento(paymentDialog.parcelaId, paymentData);
      
      if (parcelaPaga) {
        // Atualiza a parcela na lista local
        setParcelas(prev => prev.map(p => 
          p.id === paymentDialog.parcelaId ? parcelaPaga : p
        ));
        
        setNotification({
          open: true,
          message: `Pagamento da parcela ${paymentDialog.parcelaNumero} registrado com sucesso!`,
          severity: 'success'
        });
      }
      
      handleClosePaymentDialog();
    } catch (err) {
      console.error('Erro ao registrar pagamento:', err);
      
      setNotification({
        open: true,
        message: 'Erro ao registrar pagamento: ' + (err.message || 'Erro desconhecido'),
        severity: 'error'
      });
    }
  };
  
  // Calcula totais
  const calcularTotais = () => {
    let totalParcelas = 0;
    let totalPago = 0;
    let totalPendente = 0;
    
    parcelas.forEach(parcela => {
      totalParcelas += parcela.valor;
      
      if (parcela.dataPagamento) {
        totalPago += parcela.valorPago || parcela.valor;
      } else {
        totalPendente += parcela.valor;
      }
    });
    
    return {
      totalParcelas,
      totalPago,
      totalPendente
    };
  };
  
  const totais = calcularTotais();
  
  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Parcelas do Contrato
        </Typography>
        
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Typography variant="body1">
              <strong>Total do Contrato:</strong> {formatCurrency(totais.totalParcelas)}
            </Typography>
            <Typography variant="body1">
              <strong>Total Pago:</strong> {formatCurrency(totais.totalPago)}
            </Typography>
            <Typography variant="body1">
              <strong>Total Pendente:</strong> {formatCurrency(totais.totalPendente)}
            </Typography>
          </Box>
        </Paper>
        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }}>
                <TableCell>Nº</TableCell>
                <TableCell>Vencimento</TableCell>
                <TableCell align="right">Valor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Pagamento</TableCell>
                <TableCell align="right">Valor Pago</TableCell>
                <TableCell>Forma</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parcelas.length > 0 ? (
                parcelas.map((parcela) => {
                  const status = getParcelaStatus(parcela);
                  
                  return (
                    <TableRow 
                      key={parcela.id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' 
                        }
                      }}
                    >
                      <TableCell>{parcela.numero}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ fontSize: 'small', mr: 1, color: 'text.secondary' }} />
                          {formatDate(parcela.dataVencimento)}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{formatCurrency(parcela.valor)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={status.charAt(0).toUpperCase() + status.slice(1)} 
                          color={getStatusColor(status)} 
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        {parcela.dataPagamento ? (
                          formatDate(parcela.dataPagamento)
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {parcela.valorPago ? formatCurrency(parcela.valorPago) : '-'}
                      </TableCell>
                      <TableCell>
                        {parcela.formaPagamento ? (
                          parcela.formaPagamento.charAt(0).toUpperCase() + parcela.formaPagamento.slice(1)
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          {!parcela.dataPagamento && (
                            <Tooltip title="Registrar Pagamento">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenPaymentDialog(parcela)}
                              >
                                <PaymentIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {parcela.dataPagamento && (
                            <Tooltip title="Imprimir Recibo">
                              <IconButton
                                size="small"
                                color="primary"
                              >
                                <PrintIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      Nenhuma parcela encontrada.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      {/* Diálogo para registrar pagamento */}
      <Dialog
        open={paymentDialog.open}
        onClose={handleClosePaymentDialog}
      >
        <DialogTitle>Registrar Pagamento da Parcela {paymentDialog.parcelaNumero}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
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
                <MenuItem value="dinheiro">Dinheiro</MenuItem>
                <MenuItem value="pix">PIX</MenuItem>
                <MenuItem value="transferencia">Transferência</MenuItem>
                <MenuItem value="cartao">Cartão</MenuItem>
                <MenuItem value="cheque">Cheque</MenuItem>
                <MenuItem value="boleto">Boleto</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Observações"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={paymentData.observacoes}
              onChange={(e) => handlePaymentDataChange('observacoes', e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cancelar</Button>
          <Button 
            onClick={handleConfirmPayment} 
            color="primary" 
            variant="contained"
            disabled={loading}
          >
            Registrar
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

export default ParcelasContrato;