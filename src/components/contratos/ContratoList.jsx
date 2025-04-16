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
  useTheme,
  useMediaQuery
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const { contratos, lotes, loading, error, loadContratos, deleteContrato, gerarPreviaContrato } = useContratos();
  const { clientes, loadClientes } = useClientes();
  
  // Estados locais
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContratos, setFilteredContratos] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    contratoId: null,
    clienteNome: '',
    loteInfo: ''
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
    const cliente = clientes.find(c => c.id === contrato.clienteId) || { nome: 'Cliente não encontrado' };
    const lote = lotes.find(l => l.id === contrato.loteId) || { loteamento: 'Loteamento não encontrado', quadra: '-', numero: '-' };
    
    setDeleteDialog({
      open: true,
      contratoId: contrato.id,
      clienteNome: cliente.nome,
      loteInfo: `${lote.loteamento} - Quadra ${lote.quadra}, Lote ${lote.numero}`
    });
  };
  
  const handleConfirmDelete = async () => {
    try {
      await deleteContrato(deleteDialog.contratoId);
      setDeleteDialog({ open: false, contratoId: null, clienteNome: '', loteInfo: '' });
    } catch (error) {
      console.error('Erro ao excluir contrato:', error);
    }
  };
  
  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, contratoId: null, clienteNome: '', loteInfo: '' });
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
  
  // Definir colunas a serem exibidas com base no tamanho da tela
  const getVisibleColumns = () => {
    if (isMobile) {
      return ['cliente', 'lote', 'acoes'];
    } else if (isTablet) {
      return ['cliente', 'lote', 'valor', 'parcelas', 'acoes'];
    }
    return ['cliente', 'lote', 'valor', 'periodo', 'parcelas', 'status', 'acoes'];
  };
  
  const visibleColumns = getVisibleColumns();
  
  // Renderiza a tabela de contratos
  return (
    <>
      <Loading open={loading || loading2} />
      
      <Paper 
        sx={{ 
          width: '100%', 
          mb: 2, 
          borderRadius: 2, 
          overflow: 'hidden',
          boxShadow: 2
        }}
      >
        <Toolbar
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: isMobile ? 2 : 0,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography
            sx={{ flex: isMobile ? 'none' : '1 1 100%', fontWeight: 600 }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Contratos
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            width: isMobile ? '100%' : 'auto',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar contrato..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ 
                width: isMobile ? '100%' : '300px',
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
              }}
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
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 500,
                px: 2,
                py: 1,
                height: isMobile ? 'auto' : 40,
                whiteSpace: 'nowrap', // Impede quebra de linha
                minWidth: isMobile ? '100%' : 'auto',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease'
                }
              }}
            >
              Novo Contrato
            </Button>
          </Box>
        </Toolbar>
        
        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table 
            aria-labelledby="tableTitle"
            size="medium"
            sx={{ 
              minWidth: isMobile ? 300 : 750,
              tableLayout: 'fixed'
            }}
          >
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: theme => theme.palette.mode === 'light' 
                  ? 'rgba(0, 0, 0, 0.02)' 
                  : 'rgba(255, 255, 255, 0.05)' 
              }}>
                {visibleColumns.includes('cliente') && (
                  <TableCell 
                    sx={{ 
                      width: isMobile ? '40%' : '20%', 
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Cliente
                  </TableCell>
                )}
                {visibleColumns.includes('lote') && (
                  <TableCell 
                    sx={{ 
                      width: isMobile ? '40%' : '20%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Lote
                  </TableCell>
                )}
                {visibleColumns.includes('valor') && (
                  <TableCell 
                    sx={{ 
                      width: '15%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Valor
                  </TableCell>
                )}
                {visibleColumns.includes('periodo') && (
                  <TableCell 
                    sx={{ 
                      width: '15%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Período
                  </TableCell>
                )}
                {visibleColumns.includes('parcelas') && (
                  <TableCell 
                    sx={{ 
                      width: isTablet ? '20%' : '10%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Parcelas
                  </TableCell>
                )}
                {visibleColumns.includes('status') && (
                  <TableCell 
                    sx={{ 
                      width: '10%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Status
                  </TableCell>
                )}
                {visibleColumns.includes('acoes') && (
                  <TableCell 
                    align="right"
                    sx={{ 
                      width: isMobile ? '20%' : '10%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Ações
                  </TableCell>
                )}
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
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { 
                          backgroundColor: theme => theme.palette.mode === 'light' 
                            ? 'rgba(0, 0, 0, 0.04)' 
                            : 'rgba(255, 255, 255, 0.08)' 
                        }
                      }}
                    >
                      {visibleColumns.includes('cliente') && (
                        <TableCell 
                        component="th" 
                        scope="row"
                        sx={{ 
                          borderBottom: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Tooltip title={cliente.nome}>
                            <Box>
                              <Typography 
                                variant="body1"
                                sx={{ 
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: isMobile ? '120px' : '180px' // Limita largura
                                }}
                              >
                                {cliente.nome}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color="textSecondary"
                                sx={{ 
                                  display: 'block',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {cliente.cpfCnpj}
                              </Typography>
                            </Box>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      )}
                      
                      {visibleColumns.includes('lote') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LandscapeIcon sx={{ mr: 1, color: 'secondary.main' }} />
                            <Box>
                              <Typography 
                                variant="body2"
                                sx={{ 
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {lote.loteamento}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color="textSecondary"
                                sx={{ 
                                  display: 'block',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {`Quadra ${lote.quadra}, Lote ${lote.numero} (${lote.area}m²)`}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      )}
                      
                      {visibleColumns.includes('valor') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            fontWeight="bold"
                            sx={{ 
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {formatCurrency(contrato.valorTotal)}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="textSecondary"
                            sx={{ 
                              display: 'block',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            Entrada: {formatCurrency(contrato.valorEntrada)}
                          </Typography>
                        </TableCell>
                      )}
                      
                      {visibleColumns.includes('periodo') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarIcon sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="body2">
                                {formatDate(contrato.dataInicio)}
                              </Typography>
                              <Typography variant="body2">
                                {formatDate(contrato.dataFim)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      )}
                      
                      {visibleColumns.includes('parcelas') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Typography variant="body2">
                            {contrato.numeroParcelas}x de
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {formatCurrency((contrato.valorTotal - contrato.valorEntrada) / contrato.numeroParcelas)}
                          </Typography>
                        </TableCell>
                      )}
                      
                      {visibleColumns.includes('status') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Chip 
                            label={contrato.status || 'Ativo'} 
                            color={
                              contrato.status === 'cancelado' ? 'error' : 
                              contrato.status === 'concluído' ? 'success' : 
                              'primary'
                            }
                            size="small"
                            sx={{ 
                              fontWeight: 500,
                              borderRadius: 4
                            }}
                          />
                        </TableCell>
                      )}
                      
                      {visibleColumns.includes('acoes') && (
                        <TableCell 
                          align="right"
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Tooltip title="Visualizar">
                            <IconButton 
                              aria-label="visualizar" 
                              onClick={() => handlePreviewContrato(contrato)}
                              sx={{ 
                                '&:hover': { 
                                  transform: 'translateY(-2px)',
                                  transition: 'transform 0.2s ease' 
                                } 
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton 
                              aria-label="editar" 
                              onClick={() => handleEditContrato(contrato.id)}
                              sx={{ 
                                '&:hover': { 
                                  transform: 'translateY(-2px)',
                                  transition: 'transform 0.2s ease' 
                                } 
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir">
                            <IconButton 
                              aria-label="excluir" 
                              onClick={() => handleDeleteClick(contrato)}
                              sx={{ 
                                '&:hover': { 
                                  transform: 'translateY(-2px)',
                                  transition: 'transform 0.2s ease' 
                                } 
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                
              {filteredContratos.length === 0 && (
                <TableRow>
                  <TableCell 
                    colSpan={visibleColumns.length} 
                    align="center"
                    sx={{ 
                      py: 4,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant="body1">
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
          labelRowsPerPage={isMobile ? "Itens:" : "Itens por página:"}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          sx={{ 
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        />
      </Paper>
      
      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: isMobile ? '95%' : '500px'
          }
        }}
      >
        <DialogTitle 
          id="alert-dialog-title"
          sx={{ 
            fontWeight: 600,
            pb: 1
          }}
        >
          Excluir Contrato
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir o contrato do cliente "{deleteDialog.clienteNome}" referente ao lote "{deleteDialog.loteInfo}"? Esta ação não pode ser desfeita e o lote será liberado para novas vendas.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleCancelDelete} 
            color="primary"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 500
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            autoFocus
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 500,
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease'
              }
            }}
          >
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
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Visualização do Contrato</DialogTitle>
        <DialogContent>
          <ContratoPreview conteudo={previewDialog.conteudo} />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleClosePreview} 
            color="primary"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 500
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContratoList;