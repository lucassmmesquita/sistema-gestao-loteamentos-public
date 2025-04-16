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
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Description as DocumentIcon
} from '@mui/icons-material';
import useClientes from '../../hooks/useClientes';
import useContratos from '../../hooks/useContratos';
import { formatCPFouCNPJ, formatDate } from '../../utils/formatters';
import Loading from '../common/Loading';

const ClienteList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const { clientes, loading, error, loadClientes, deleteCliente } = useClientes();
  const { loadContratosByCliente } = useContratos();
  
  // Estados locais
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [clienteContratos, setClienteContratos] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    clienteId: null,
    clienteNome: ''
  });
  
  // Carrega os clientes ao montar o componente
  useEffect(() => {
    loadClientes();
  }, [loadClientes]);
  
  // Filtra os clientes com base no termo de busca
  useEffect(() => {
    if (!clientes) {
      setFilteredClientes([]);
      return;
    }
    
    if (!searchTerm.trim()) {
      setFilteredClientes(clientes);
      return;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = clientes.filter((cliente) => {
      return (
        cliente.nome.toLowerCase().includes(lowercasedSearch) ||
        cliente.cpfCnpj.toLowerCase().includes(lowercasedSearch) ||
        (cliente.contatos.emails && cliente.contatos.emails.some(email => 
          email.toLowerCase().includes(lowercasedSearch)
        )) ||
        (cliente.contatos.telefones && cliente.contatos.telefones.some(telefone => 
          telefone.includes(lowercasedSearch)
        )) ||
        (cliente.endereco.cidade && cliente.endereco.cidade.toLowerCase().includes(lowercasedSearch))
      );
    });
    
    setFilteredClientes(filtered);
  }, [searchTerm, clientes]);
  
  // Carrega os contratos de cada cliente
  useEffect(() => {
    const loadClientesContratos = async () => {
      const contratosMap = {};
      
      for (const cliente of filteredClientes) {
        try {
          const contratos = await loadContratosByCliente(cliente.id);
          contratosMap[cliente.id] = contratos;
        } catch (err) {
          console.error(`Erro ao carregar contratos do cliente ${cliente.id}:`, err);
          contratosMap[cliente.id] = [];
        }
      }
      
      setClienteContratos(contratosMap);
    };
    
    if (filteredClientes.length > 0) {
      loadClientesContratos();
    }
  }, [filteredClientes, loadContratosByCliente]);
  
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
  
  const handleAddCliente = () => {
    navigate('/clientes/cadastro');
  };
  
  const handleEditCliente = (id) => {
    navigate(`/clientes/editar/${id}`);
  };
  
  const handleDeleteClick = (cliente) => {
    setDeleteDialog({
      open: true,
      clienteId: cliente.id,
      clienteNome: cliente.nome
    });
  };
  
  const handleConfirmDelete = async () => {
    try {
      await deleteCliente(deleteDialog.clienteId);
      setDeleteDialog({ open: false, clienteId: null, clienteNome: '' });
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };
  
  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, clienteId: null, clienteNome: '' });
  };

  // Definir colunas a serem exibidas com base no tamanho da tela
  const getVisibleColumns = () => {
    if (isMobile) {
      return ['nome', 'contatos', 'acoes'];
    } else if (isTablet) {
      return ['nome', 'cpfCnpj', 'contatos', 'contratos', 'acoes'];
    }
    return ['nome', 'cpfCnpj', 'dataNascimento', 'contatos', 'cidadeEstado', 'contratos', 'documentos', 'acoes'];
  };
  
  const visibleColumns = getVisibleColumns();
  
  // Renderiza a tabela de clientes
  return (
    <>
      <Loading open={loading} />
      
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
            Clientes
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
              placeholder="Buscar cliente..."
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
              onClick={handleAddCliente}
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
              Novo Cliente
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
                {visibleColumns.includes('nome') && (
                  <TableCell 
                    sx={{ 
                      width: isMobile ? '50%' : '20%', 
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Nome
                  </TableCell>
                )}
                {visibleColumns.includes('cpfCnpj') && (
                  <TableCell 
                    sx={{ 
                      width: '15%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    CPF/CNPJ
                  </TableCell>
                )}
                {visibleColumns.includes('dataNascimento') && (
                  <TableCell 
                    sx={{ 
                      width: '10%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Data de Nascimento
                  </TableCell>
                )}
                {visibleColumns.includes('contatos') && (
                  <TableCell 
                    sx={{ 
                      width: isMobile ? '30%' : '15%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Contatos
                  </TableCell>
                )}
                {visibleColumns.includes('cidadeEstado') && (
                  <TableCell 
                    sx={{ 
                      width: '10%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Cidade/Estado
                  </TableCell>
                )}
                {visibleColumns.includes('contratos') && (
                  <TableCell 
                    sx={{ 
                      width: '10%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Contratos
                  </TableCell>
                )}
                {visibleColumns.includes('documentos') && (
                  <TableCell 
                    sx={{ 
                      width: '10%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Documentos
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
              {filteredClientes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((cliente) => {
                  const contratos = clienteContratos[cliente.id] || [];
                  
                  return (
                    <TableRow
                      hover
                      key={cliente.id}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { 
                          backgroundColor: theme => theme.palette.mode === 'light' 
                            ? 'rgba(0, 0, 0, 0.04)' 
                            : 'rgba(255, 255, 255, 0.08)' 
                        }
                      }}
                    >
                      {visibleColumns.includes('nome') && (
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
                            <Typography 
                              variant="body1"
                              sx={{ 
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {cliente.nome}
                            </Typography>
                          </Box>
                        </TableCell>
                      )}
                      
                      {visibleColumns.includes('cpfCnpj') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          {formatCPFouCNPJ(cliente.cpfCnpj)}
                        </TableCell>
                      )}
                      
                      {visibleColumns.includes('dataNascimento') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          {formatDate(cliente.dataNascimento)}
                        </TableCell>
                      )}
                      
                      {visibleColumns.includes('contatos') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Box>
                            {cliente.contatos?.telefones?.[0] && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <PhoneIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                <Typography 
                                  variant="body2"
                                  sx={{ 
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {cliente.contatos.telefones[0]}
                                </Typography>
                              </Box>
                            )}
                            {cliente.contatos?.emails?.[0] && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <EmailIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                <Typography 
                                  variant="body2"
                                  sx={{ 
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {cliente.contatos.emails[0]}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                      )}
                      
                      {visibleColumns.includes('cidadeEstado') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          {cliente.endereco?.cidade && (
                            <Typography 
                              variant="body2"
                              sx={{ 
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {cliente.endereco.cidade}/{cliente.endereco.estado}
                            </Typography>
                          )}
                        </TableCell>
                      )}
                      
                      {visibleColumns.includes('contratos') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Chip 
                            label={`${contratos.length} contrato(s)`} 
                            color={contratos.length > 0 ? "primary" : "default"}
                            size="small"
                            sx={{ 
                              fontWeight: 500,
                              borderRadius: 4
                            }}
                          />
                        </TableCell>
                      )}
                      
                      {visibleColumns.includes('documentos') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DocumentIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">
                              {cliente.documentos?.length || 0}
                            </Typography>
                          </Box>
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
                          <Tooltip title="Editar">
                            <IconButton 
                              aria-label="editar" 
                              onClick={() => handleEditCliente(cliente.id)}
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
                            <span>
                              <IconButton 
                                aria-label="excluir" 
                                onClick={() => handleDeleteClick(cliente)}
                                disabled={contratos.length > 0}
                                sx={{ 
                                  '&:hover': { 
                                    transform: 'translateY(-2px)',
                                    transition: 'transform 0.2s ease' 
                                  } 
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                
              {filteredClientes.length === 0 && (
                <TableRow>
                  <TableCell 
                    colSpan={8} 
                    align="center"
                    sx={{ 
                      py: 4,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant="body1">
                      {searchTerm 
                        ? 'Nenhum cliente encontrado para esta busca.' 
                        : 'Nenhum cliente cadastrado.'}
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
          count={filteredClientes.length}
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
          Excluir Cliente
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir o cliente "{deleteDialog.clienteNome}"? Esta ação não pode ser desfeita.
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
    </>
  );
};

export default ClienteList;