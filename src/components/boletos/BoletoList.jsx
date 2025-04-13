import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Checkbox,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  Link
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Print as PrintIcon,
  CloudDownload as DownloadIcon,
  Delete as DeleteIcon,
  RemoveRedEye as ViewIcon,
  Receipt as ReceiptIcon,
  Link as LinkIcon,
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
  Payment as PaymentIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useBoletos from '../../hooks/useBoletos';
import StatusBoleto from './StatusBoleto';
import ExportarBoletos from './ExportarBoletos';
import Loading from '../common/Loading';

// Função para comparador de ordenação
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Função para ordenar array estável
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Cabeçalhos da tabela
const headCells = [
  { id: 'nossoNumero', numeric: false, disablePadding: false, label: 'Nosso Número' },
  { id: 'clienteNome', numeric: false, disablePadding: false, label: 'Cliente' },
  { id: 'valor', numeric: true, disablePadding: false, label: 'Valor' },
  { id: 'dataVencimento', numeric: false, disablePadding: false, label: 'Vencimento' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'dataPagamento', numeric: false, disablePadding: false, label: 'Pagamento' },
  { id: 'valorPago', numeric: true, disablePadding: false, label: 'Valor Pago' },
  { id: 'acoes', numeric: false, disablePadding: false, label: 'Ações', sorting: false }
];

const BoletoList = () => {
  const { 
    filteredBoletos, 
    loading, 
    error,
    filtros,
    atualizarFiltros,
    limparFiltros,
    cancelarBoleto,
    registrarPagamento,
    exportarParaExcel,
    exportarParaPDF,
    gerarArquivoRemessa
  } = useBoletos();
  
  // Estados locais
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('dataVencimento');
  const [selected, setSelected] = useState([]);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [cancelDialog, setCancelDialog] = useState({ open: false, boletoId: null });
  const [paymentDialog, setPaymentDialog] = useState({ open: false, boletoId: null });
  const [actionsMenuAnchor, setActionsMenuAnchor] = useState(null);
  const [currentBoletoActions, setCurrentBoletoActions] = useState(null);
  const [remessaLoading, setRemessaLoading] = useState(false);
  
  // Pagamento manual
  const [paymentData, setPaymentData] = useState({
    dataPagamento: format(new Date(), 'yyyy-MM-dd'),
    valorPago: '',
    formaPagamento: 'manual'
  });
  
  // Manipuladores de eventos para a tabela
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredBoletos.map(b => b.id);
      setSelected(newSelecteds);
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
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleBuscaChange = (event) => {
    atualizarFiltros({ busca: event.target.value });
    setPage(0);
  };
  
  const handleLimparBusca = () => {
    atualizarFiltros({ busca: '' });
  };
  
  // Manipuladores para o menu de filtros
  const handleOpenFilterMenu = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };
  
  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };
  
  const handleFilterChange = (filter, value) => {
    atualizarFiltros({ [filter]: value });
    setPage(0);
  };
  
  const handleLimparFiltros = () => {
    limparFiltros();
    handleCloseFilterMenu();
  };
  
  // Manipuladores para o menu de exportação
  const handleOpenExportMenu = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };
  
  const handleCloseExportMenu = () => {
    setExportMenuAnchor(null);
  };
  
  const handleExportExcel = () => {
    exportarParaExcel();
    handleCloseExportMenu();
  };
  
  const handleExportPDF = () => {
    exportarParaPDF();
    handleCloseExportMenu();
  };
  
  // Manipuladores para o menu de ações por boleto
  const handleOpenActionsMenu = (event, boleto) => {
    event.stopPropagation();
    setActionsMenuAnchor(event.currentTarget);
    setCurrentBoletoActions(boleto);
  };
  
  const handleCloseActionsMenu = () => {
    setActionsMenuAnchor(null);
    setCurrentBoletoActions(null);
  };
  
  // Manipuladores para cancelamento de boleto
  const handleOpenCancelDialog = (boletoId) => {
    setCancelDialog({ open: true, boletoId });
    handleCloseActionsMenu();
  };
  
  const handleCloseCancelDialog = () => {
    setCancelDialog({ open: false, boletoId: null });
  };
  
  const handleConfirmCancel = async () => {
    if (cancelDialog.boletoId) {
      await cancelarBoleto(cancelDialog.boletoId);
    }
    handleCloseCancelDialog();
  };
  
  // Manipuladores para registro de pagamento
  const handleOpenPaymentDialog = (boleto) => {
    setPaymentDialog({ open: true, boletoId: boleto.id });
    setPaymentData({
      dataPagamento: format(new Date(), 'yyyy-MM-dd'),
      valorPago: boleto.valor,
      formaPagamento: 'manual'
    });
    handleCloseActionsMenu();
  };
  
  const handleClosePaymentDialog = () => {
    setPaymentDialog({ open: false, boletoId: null });
  };
  
  const handlePaymentDataChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleConfirmPayment = async () => {
    if (paymentDialog.boletoId) {
      await registrarPagamento(paymentDialog.boletoId, paymentData);
    }
    handleClosePaymentDialog();
  };
  
  // Manipulador para geração de arquivo de remessa
  const handleGerarRemessa = async () => {
    if (selected.length === 0) return;
    
    setRemessaLoading(true);
    
    try {
      const resultado = await gerarArquivoRemessa(selected);
      
      if (resultado && resultado.blob) {
        const url = URL.createObjectURL(resultado.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = resultado.nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Erro ao gerar arquivo de remessa:', error);
    } finally {
      setRemessaLoading(false);
    }
  };
  
  // Verifica se um item está selecionado
  const isSelected = (id) => selected.indexOf(id) !== -1;
  
  // Verifica se há seleções
  const hasSelections = selected.length > 0;
  
  // Conta quantos items por página
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredBoletos.length) : 0;
  
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
    <Box sx={{ width: '100%' }}>
      <Loading open={loading || remessaLoading} />
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(hasSelections && {
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            }),
          }}
        >
          {hasSelections ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selected.length} {selected.length === 1 ? 'boleto selecionado' : 'boletos selecionados'}
            </Typography>
          ) : (
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Boletos
            </Typography>
          )}
          
          {/* Filtros e exportação apenas quando não há seleções */}
          {!hasSelections ? (
            <>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Buscar boleto..."
                value={filtros.busca || ''}
                onChange={handleBuscaChange}
                sx={{ mr: 2, width: { xs: '100%', sm: '300px' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: filtros.busca && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        aria-label="limpar busca"
                        onClick={handleLimparBusca}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <Tooltip title="Filtros">
                <IconButton onClick={handleOpenFilterMenu}>
                  <FilterIcon />
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={filterMenuAnchor}
                open={Boolean(filterMenuAnchor)}
                onClose={handleCloseFilterMenu}
                PaperProps={{
                  sx: { width: 250, p: 2 }
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Filtrar Boletos
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filtros.status || ''}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    size="small"
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="gerado">Gerado</MenuItem>
                    <MenuItem value="pago">Pago</MenuItem>
                    <MenuItem value="vencido">Vencido</MenuItem>
                    <MenuItem value="cancelado">Cancelado</MenuItem>
                  </Select>
                </FormControl>
                
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Período de Vencimento
                </Typography>
                
                <TextField
                  label="De"
                  type="date"
                  size="small"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={filtros.dataInicio || ''}
                  onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                
                <TextField
                  label="Até"
                  type="date"
                  size="small"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={filtros.dataFim || ''}
                  onChange={(e) => handleFilterChange('dataFim', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={handleLimparFiltros}
                  startIcon={<ClearIcon />}
                >
                  Limpar Filtros
                </Button>
              </Menu>
              
              <Tooltip title="Exportar">
                <IconButton onClick={handleOpenExportMenu}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={exportMenuAnchor}
                open={Boolean(exportMenuAnchor)}
                onClose={handleCloseExportMenu}
              >
                <MenuItem onClick={handleExportExcel}>
                  <DownloadIcon sx={{ mr: 1 }} /> Exportar para Excel
                </MenuItem>
                <MenuItem onClick={handleExportPDF}>
                  <PrintIcon sx={{ mr: 1 }} /> Exportar para PDF
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ReceiptIcon />}
                onClick={handleGerarRemessa}
                sx={{ mr: 1 }}
              >
                Gerar Remessa
              </Button>
              
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<ClearIcon />}
                onClick={() => setSelected([])}
              >
                Limpar Seleção
              </Button>
            </>
          )}
        </Toolbar>
        
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < filteredBoletos.length}
                    checked={filteredBoletos.length > 0 && selected.length === filteredBoletos.length}
                    onChange={handleSelectAllClick}
                    inputProps={{
                      'aria-label': 'selecionar todos os boletos',
                    }}
                  />
                </TableCell>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    padding={headCell.disablePadding ? 'none' : 'normal'}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    {headCell.sorting !== false ? (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, headCell.id)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(filteredBoletos, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((boleto, index) => {
                  const isItemSelected = isSelected(boleto.id);
                  const labelId = `boleto-table-checkbox-${index}`;
                  
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
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <Link
                          component={RouterLink}
                          to={`/boletos/${boleto.id}`}
                          onClick={(e) => e.stopPropagation()}
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
                          {boleto.nossoNumero}
                        </Link>
                      </TableCell>
                      <TableCell>{boleto.clienteNome}</TableCell>
                      <TableCell align="right">{formatCurrency(boleto.valor)}</TableCell>
                      <TableCell>{formatDate(boleto.dataVencimento)}</TableCell>
                      <TableCell>
                        <StatusBoleto status={boleto.status} />
                      </TableCell>
                      <TableCell>{boleto.dataPagamento ? formatDate(boleto.dataPagamento) : '-'}</TableCell>
                      <TableCell align="right">{boleto.valorPago ? formatCurrency(boleto.valorPago) : '-'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="Visualizar">
                            <IconButton
                              color="primary"
                              component={RouterLink}
                              to={`/boletos/${boleto.id}`}
                              onClick={(e) => e.stopPropagation()}
                              size="small"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          
                          {boleto.pdfUrl && (
                            <Tooltip title="Download do Boleto">
                              <IconButton
                                color="primary"
                                href={boleto.pdfUrl}
                                target="_blank"
                                onClick={(e) => e.stopPropagation()}
                                size="small"
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          <Tooltip title="Mais Ações">
                            <IconButton
                              size="small"
                              onClick={(e) => handleOpenActionsMenu(e, boleto)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={9} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredBoletos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>
      
      {/* Menu de ações para um boleto específico */}
      <Menu
        anchorEl={actionsMenuAnchor}
        open={Boolean(actionsMenuAnchor)}
        onClose={handleCloseActionsMenu}
      >
        {currentBoletoActions && (
          <>
            <MenuItem 
              component={RouterLink} 
              to={`/boletos/${currentBoletoActions.id}`}
              onClick={handleCloseActionsMenu}
            >
              <ViewIcon sx={{ mr: 1 }} /> Visualizar Detalhes
            </MenuItem>
            
            {currentBoletoActions.status === 'gerado' && (
              <MenuItem onClick={() => handleOpenPaymentDialog(currentBoletoActions)}>
                <PaymentIcon sx={{ mr: 1 }} /> Registrar Pagamento
              </MenuItem>
            )}
            
            {currentBoletoActions.status === 'gerado' && (
              <MenuItem onClick={() => handleOpenCancelDialog(currentBoletoActions.id)}>
                <CancelIcon sx={{ mr: 1 }} /> Cancelar Boleto
              </MenuItem>
            )}
            
            {currentBoletoActions.pdfUrl && (
              <MenuItem 
                component="a" 
                href={currentBoletoActions.pdfUrl} 
                target="_blank"
                onClick={handleCloseActionsMenu}
              >
                <DownloadIcon sx={{ mr: 1 }} /> Download PDF
              </MenuItem>
            )}
            
            {currentBoletoActions.linhaDigitavel && (
              <MenuItem 
                onClick={() => {
                  navigator.clipboard.writeText(currentBoletoActions.linhaDigitavel);
                  handleCloseActionsMenu();
                }}
              >
                <LinkIcon sx={{ mr: 1 }} /> Copiar Linha Digitável
              </MenuItem>
            )}
          </>
        )}
      </Menu>
      
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
    </Box>
  );
};

export default BoletoList;