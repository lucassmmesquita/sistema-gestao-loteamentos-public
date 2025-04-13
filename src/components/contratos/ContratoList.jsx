import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  CardActions,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Landscape as LandscapeIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import useContratos from '../../hooks/useContratos';
import useClientes from '../../hooks/useClientes';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Loading from '../common/Loading';
import ContratoPreview from './ContratoPreview';

const ContratoList = () => {
  const navigate = useNavigate();
  const { contratos, lotes, loading, error, loadContratos, deleteContrato, gerarPreviaContrato } = useContratos();
  const { clientes, loadClientes } = useClientes();
  
  // Estados locais
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContratos, setFilteredContratos] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    contratoId: null
  });
  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    contrato: null,
    conteudo: ''
  });
  const [loading2, setLoading2] = useState(false);
  
  // Carrega os contratos ao montar o componente
  useEffect(() => {
    loadContratos();
    loadClientes();
  }, [loadContratos, loadClientes]);
  
  // Filtra os contratos com base no termo de busca
  useEffect(() => {
    if (!contratos) {
      setFilteredContratos([]);
      return;
    }
    
    if (!searchTerm.trim()) {
      setFilteredContratos(contratos);
      return;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = contratos.filter((contrato) => {
      // Encontra o cliente correspondente
      const cliente = clientes.find(c => c.id === contrato.clienteId);
      const clienteNome = cliente ? cliente.nome.toLowerCase() : '';
      
      // Encontra o lote correspondente
      const lote = lotes.find(l => l.id === contrato.loteId);
      const loteInfo = lote ? 
        `${lote.loteamento.toLowerCase()} quadra ${lote.quadra.toLowerCase()} lote ${lote.numero.toLowerCase()}` : '';
      
      return (
        clienteNome.includes(lowercasedSearch) ||
        loteInfo.includes(lowercasedSearch) ||
        contrato.status?.toLowerCase().includes(lowercasedSearch) ||
        formatCurrency(contrato.valorTotal).includes(lowercasedSearch)
      );
    });
    
    setFilteredContratos(filtered);
  }, [searchTerm, contratos, clientes, lotes]);
  
  // Manipuladores de eventos
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  const handleAddContrato = () => {
    navigate('/contratos/cadastro');
  };
  
  const handleEditContrato = (id) => {
    navigate(`/contratos/editar/${id}`);
  };
  
  const handleDeleteClick = (contrato) => {
    setDeleteDialog({
      open: true,
      contratoId: contrato.id
    });
  };
  
  const handleConfirmDelete = async () => {
    try {
      await deleteContrato(deleteDialog.contratoId);
      setDeleteDialog({ open: false, contratoId: null });
    } catch (error) {
      console.error('Erro ao excluir contrato:', error);
    }
  };
  
  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, contratoId: null });
  };
  
  const handlePreviewContrato = async (contrato) => {
    setLoading2(true);
    
    try {
      const previa = await gerarPreviaContrato(contrato);
      
      if (previa) {
        setPreviewDialog({
          open: true,
          contrato,
          conteudo: previa
        });
      }
    } catch (error) {
      console.error('Erro ao gerar prévia do contrato:', error);
    } finally {
      setLoading2(false);
    }
  };
  
  const handleClosePreview = () => {
    setPreviewDialog({
      open: false,
      contrato: null,
      conteudo: ''
    });
  };
  
  // Função para obter informações do cliente
  const getClienteInfo = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente : { nome: 'Cliente não encontrado', cpfCnpj: '' };
  };
  
  // Função para obter informações do lote
  const getLoteInfo = (loteId) => {
    const lote = lotes.find(l => l.id === loteId);
    return lote ? lote : { 
      loteamento: 'Loteamento não encontrado', 
      quadra: '-', 
      numero: '-', 
      area: 0 
    };
  };
  
  // Renderiza a tabela de contratos
  return (
    <>
      <Loading open={loading || loading2} />
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 }
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Contratos
          </Typography>
          
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar contrato..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mr: 2, width: { xs: '100%', sm: '300px' } }}
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
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddContrato}
          >
            Novo Contrato
          </Button>
        </Toolbar>
        
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Lote</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Período</TableCell>
                <TableCell>Parcelas</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContratos
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((contrato) => {
                  const cliente = getClienteInfo(contrato.clienteId);
                  const lote = getLoteInfo(contrato.loteId);
                  
                  return (
                    <TableRow
                      hover
                      key={contrato.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="body1">{cliente.nome}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {cliente.cpfCnpj}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LandscapeIcon sx={{ mr: 1, color: 'secondary.main' }} />
                          <Box>
                            <Typography variant="body2">
                              {`${lote.loteamento}`}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {`Quadra ${lote.quadra}, Lote ${lote.numero} (${lote.area}m²)`}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(contrato.valorTotal)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Entrada: {formatCurrency(contrato.valorEntrada)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2">
                              {formatDate(contrato.dataInicio)} a
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(contrato.dataFim)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {contrato.numeroParcelas}x de
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency((contrato.valorTotal - contrato.valorEntrada) / contrato.numeroParcelas)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={contrato.status || 'Ativo'} 
                          color={
                            contrato.status === 'cancelado' ? 'error' : 
                            contrato.status === 'concluído' ? 'success' : 
                            'primary'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Visualizar">
                          <IconButton 
                            aria-label="visualizar" 
                            onClick={() => handlePreviewContrato(contrato)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton 
                            aria-label="editar" 
                            onClick={() => handleEditContrato(contrato.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton 
                            aria-label="excluir" 
                            onClick={() => handleDeleteClick(contrato)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
                
              {filteredContratos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      {searchTerm 
                        ? 'Nenhum contrato encontrado para esta busca.' 
                        : 'Nenhum contrato cadastrado.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredContratos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>
      
      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Excluir Contrato
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita e o lote será liberado para novas vendas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de prévia do contrato */}
      <Dialog
        open={previewDialog.open}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Visualização do Contrato</DialogTitle>
        <DialogContent>
          <ContratoPreview conteudo={previewDialog.conteudo} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContratoList;