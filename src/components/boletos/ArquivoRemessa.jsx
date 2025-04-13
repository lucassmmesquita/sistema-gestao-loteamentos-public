import React, { useState } from 'react';
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
  Checkbox,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  FileUpload as UploadIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useBoletos from '../../hooks/useBoletos';
import Loading from '../common/Loading';
import StatusBoleto from './StatusBoleto';

const ArquivoRemessa = () => {
  const { filteredBoletos, gerarArquivoRemessa, loading, atualizarFiltros } = useBoletos();
  
  // Estados
  const [selected, setSelected] = useState([]);
  const [remessaLoading, setRemessaLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [successDialog, setSuccessDialog] = useState({
    open: false,
    data: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Manipuladores para a tabela
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredBoletos
        .filter(b => b.status === 'gerado') // Apenas boletos gerados
        .map(b => b.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  
  const handleSelectClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    
    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter(s => s !== id);
    }
    
    setSelected(newSelected);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    atualizarFiltros({ busca: event.target.value });
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
    atualizarFiltros({ busca: '' });
  };
  
  // Gera o arquivo de remessa
  const handleGerarRemessa = async () => {
    if (selected.length === 0) {
      setNotification({
        open: true,
        message: 'Selecione pelo menos um boleto para gerar a remessa',
        severity: 'warning'
      });
      return;
    }
    
    setRemessaLoading(true);
    
    try {
      const resultado = await gerarArquivoRemessa(selected);
      
      if (resultado && resultado.blob) {
        // Abre diálogo de sucesso com os detalhes
        setSuccessDialog({
          open: true,
          data: resultado
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Erro ao gerar arquivo de remessa: ' + error.message,
        severity: 'error'
      });
    } finally {
      setRemessaLoading(false);
    }
  };
  
  // Faz o download do arquivo de remessa
  const handleDownload = () => {
    if (!successDialog.data || !successDialog.data.blob) return;
    
    const url = URL.createObjectURL(successDialog.data.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = successDialog.data.nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Fecha o diálogo
    setSuccessDialog({ open: false, data: null });
  };
  
  // Verifica se um item está selecionado
  const isSelected = (id) => selected.indexOf(id) !== -1;
  
  // Filtra apenas boletos gerados (não pagos, não cancelados)
  const boletosDisponiveis = filteredBoletos.filter(b => b.status === 'gerado');
  
  // Formata valor como moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Formata data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  };
  
  return (
    <>
      <Loading open={loading || remessaLoading} />
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ReceiptIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
              <Typography variant="h5" component="h1">
                Geração de Arquivo de Remessa
              </Typography>
            </Box>
            
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<UploadIcon />}
                onClick={handleGerarRemessa}
                disabled={selected.length === 0 || remessaLoading}
              >
                Gerar Remessa
              </Button>
            </Box>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" paragraph>
              Selecione os boletos que deseja incluir no arquivo de remessa. Apenas boletos com status "Gerado" podem ser incluídos.
            </Typography>
            
            <Paper sx={{ p: 2 }} variant="outlined">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary">
                    Boletos disponíveis para remessa: <strong>{boletosDisponiveis.length}</strong>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Boletos selecionados: <strong>{selected.length}</strong>
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Buscar boleto..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            aria-label="clear search"
                            onClick={handleClearSearch}
                            edge="end"
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < boletosDisponiveis.length}
                      checked={boletosDisponiveis.length > 0 && selected.length === boletosDisponiveis.length}
                      onChange={handleSelectAllClick}
                      inputProps={{ 'aria-label': 'selecionar todos os boletos' }}
                    />
                  </TableCell>
                  <TableCell>Nosso Número</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Vencimento</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {boletosDisponiveis.length > 0 ? (
                  boletosDisponiveis.map((boleto) => {
                    const isItemSelected = isSelected(boleto.id);
                    
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleSelectClick(event, boleto.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={boleto.id}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': `boleto-${boleto.id}` }}
                          />
                        </TableCell>
                        <TableCell id={`boleto-${boleto.id}`}>{boleto.nossoNumero}</TableCell>
                        <TableCell>{boleto.clienteNome}</TableCell>
                        <TableCell>{boleto.descricao}</TableCell>
                        <TableCell>{formatDate(boleto.dataVencimento)}</TableCell>
                        <TableCell align="right">{formatCurrency(boleto.valor)}</TableCell>
                        <TableCell><StatusBoleto status={boleto.status} /></TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">
                        Nenhum boleto disponível para remessa.
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Apenas boletos com status "Gerado" podem ser incluídos em arquivos de remessa.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      {/* Diálogo de sucesso */}
      <Dialog
        open={successDialog.open}
        onClose={() => setSuccessDialog({ open: false, data: null })}
        aria-labelledby="remessa-success-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="remessa-success-dialog-title">
          Arquivo de Remessa Gerado com Sucesso
        </DialogTitle>
        <DialogContent>
          {successDialog.data && (
            <>
              <DialogContentText paragraph>
                O arquivo de remessa foi gerado com sucesso.
              </DialogContentText>
              
              <Paper sx={{ p: 2, mb: 3 }} variant="outlined">
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Nome do Arquivo:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {successDialog.data.nomeArquivo}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Quantidade de Registros:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {successDialog.data.quantidadeRegistros}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Valor Total:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatCurrency(successDialog.data.valorTotal)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              <DialogContentText>
                Clique no botão abaixo para fazer o download do arquivo de remessa.
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setSuccessDialog({ open: false, data: null })}
            color="primary"
          >
            Fechar
          </Button>
          <Button
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
            variant="contained"
            color="primary"
            autoFocus
          >
            Download
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

export default ArquivoRemessa;