// src/components/lotes/LoteList.jsx

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
  Landscape as LandscapeIcon,
  GridOn as GridOnIcon,
  FormatShapes as FormatShapesIcon
} from '@mui/icons-material';

import useLotes from '../../hooks/useLotes';
import useContratos from '../../hooks/useContratos';
import { formatCurrency } from '../../utils/formatters';
import Loading from '../common/Loading';

const LoteList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const { lotes, loading, error, loadLotes, deleteLote } = useLotes();
  const { loadContratosByLote } = useContratos();
  
  // Estados locais
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLotes, setFilteredLotes] = useState([]);
  const [loteContratos, setLoteContratos] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    loteId: null,
    loteInfo: ''
  });
  
  // Carrega os lotes ao montar o componente
  useEffect(() => {
    loadLotes();
  }, [loadLotes]);
  
  // Filtra os lotes com base no termo de busca
  useEffect(() => {
    if (!lotes) {
      setFilteredLotes([]);
      return;
    }
    
    if (!searchTerm.trim()) {
      setFilteredLotes(lotes);
      return;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = lotes.filter((lote) => {
      return (
        lote.quadra.toString().toLowerCase().includes(lowercasedSearch) ||
        lote.numero.toString().toLowerCase().includes(lowercasedSearch) ||
        lote.loteamento.toLowerCase().includes(lowercasedSearch) ||
        lote.status.toLowerCase().includes(lowercasedSearch) ||
        lote.area.toString().includes(lowercasedSearch) ||
        lote.chave?.toLowerCase().includes(lowercasedSearch)
      );
    });
    
    setFilteredLotes(filtered);
  }, [searchTerm, lotes]);
  
  // Carrega os contratos de cada lote
  useEffect(() => {
    const loadLotesContratos = async () => {
      const contratosMap = {};
      
      for (const lote of filteredLotes) {
        try {
          const contratos = await loadContratosByLote(lote.id);
          contratosMap[lote.id] = contratos;
        } catch (err) {
          console.error(`Erro ao carregar contratos do lote ${lote.id}:`, err);
          contratosMap[lote.id] = [];
        }
      }
      
      setLoteContratos(contratosMap);
    };
    
    if (filteredLotes.length > 0) {
      loadLotesContratos();
    }
  }, [filteredLotes, loadContratosByLote]);
  
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
  
  const handleAddLote = () => {
    navigate('/lotes/cadastro');
  };
  
  const handleEditLote = (id) => {
    navigate(`/lotes/editar/${id}`);
  };
  
  const handleDeleteClick = (lote) => {
    setDeleteDialog({
      open: true,
      loteId: lote.id,
      loteInfo: `${lote.loteamento} - Quadra ${lote.quadra}, Lote ${lote.numero}`
    });
  };
  
  const handleConfirmDelete = async () => {
    try {
      await deleteLote(deleteDialog.loteId);
      setDeleteDialog({ open: false, loteId: null, loteInfo: '' });
    } catch (error) {
      console.error('Erro ao excluir lote:', error);
    }
  };
  
  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, loteId: null, loteInfo: '' });
  };

  // Define a cor do chip com base no status do lote
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'disponivel':
        return 'success';
      case 'reservado':
        return 'warning';
      case 'vendido':
        return 'primary';
      default:
        return 'default';
    }
  };
  
  // Definir colunas a serem exibidas com base no tamanho da tela
  const getVisibleColumns = () => {
    if (isMobile) {
      return ['info', 'area', 'acoes'];
    } else if (isTablet) {
      return ['quadra', 'numero', 'loteamento', 'area', 'status', 'acoes'];
    }
    return ['quadra', 'numero', 'loteamento', 'area', 'status', 'contratos', 'chave', 'acoes'];
  };
  
  const visibleColumns = getVisibleColumns();
  
  // Renderiza a tabela de lotes
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
            Lotes
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
              placeholder="Buscar lote..."
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
              onClick={handleAddLote}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 500,
                px: 2,
                py: 1,
                height: isMobile ? 'auto' : 40,
                whiteSpace: 'nowrap',
                minWidth: isMobile ? '100%' : 'auto',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease'
                }
              }}
            >
              Novo Lote
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
                {visibleColumns.includes('info') && (
                  <TableCell 
                    sx={{ 
                      width: '60%', 
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Informações
                  </TableCell>
                )}
                
                {visibleColumns.includes('quadra') && (
                  <TableCell 
                    sx={{ 
                      width: '10%', 
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Quadra
                  </TableCell>
                )}
                
                {visibleColumns.includes('numero') && (
                  <TableCell 
                    sx={{ 
                      width: '10%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Número
                  </TableCell>
                )}
                
                {visibleColumns.includes('loteamento') && (
                  <TableCell 
                    sx={{ 
                      width: '20%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Loteamento
                  </TableCell>
                )}
                
                {visibleColumns.includes('area') && (
                  <TableCell 
                    sx={{ 
                      width: isMobile ? '20%' : '10%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Área (m²)
                  </TableCell>
                )}
                
                {visibleColumns.includes('status') && (
                  <TableCell 
                    sx={{ 
                      width: '15%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Status
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
                
                {visibleColumns.includes('chave') && (
                  <TableCell 
                    sx={{ 
                      width: '15%',
                      fontWeight: 600,
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    Chave
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
              {filteredLotes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((lote) => {
                  const contratos = loteContratos[lote.id] || [];
                  
                  return (
                    <TableRow
                      hover
                      key={lote.id}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { 
                          backgroundColor: theme => theme.palette.mode === 'light' 
                            ? 'rgba(0, 0, 0, 0.04)' 
                            : 'rgba(255, 255, 255, 0.08)' 
                        }
                      }}
                    >
                      {visibleColumns.includes('info') && (
                        <TableCell 
                          component="th" 
                          scope="row"
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LandscapeIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Box>
                              <Typography 
                                variant="body1"
                                sx={{ 
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {lote.loteamento} - Quadra {lote.quadra}, Lote {lote.numero}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Chip 
                                  label={lote.status || 'Disponível'} 
                                  color={getStatusColor(lote.status || 'disponivel')} 
                                  size="small" 
                                  sx={{ mr: 1 }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                      )}
                      
                      {visibleColumns.includes('quadra') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <GridOnIcon sx={{ mr: 1, color: 'secondary.main', fontSize: 'small' }} />
                            <Typography variant="body2">
                              {lote.quadra}
                            </Typography>
                          </Box>
                        </TableCell>
                      )}
                      
                      {visibleColumns.includes('numero') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Typography variant="body2">
                            {lote.numero}
                          </Typography>
                        </TableCell>
                      )}
                      
                      {visibleColumns.includes('loteamento') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
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
                        </TableCell>
                      )}
                      
                      {visibleColumns.includes('area') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormatShapesIcon sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {lote.area} m²
                            </Typography>
                          </Box>
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
                            label={lote.status || 'Disponível'} 
                            color={getStatusColor(lote.status || 'disponivel')} 
                            size="small"
                            sx={{ 
                              fontWeight: 500,
                              borderRadius: 4
                            }}
                          />
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
                      
                      {visibleColumns.includes('chave') && (
                        <TableCell
                          sx={{ 
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Typography 
                            variant="body2"
                            sx={{ 
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {lote.chave || '-'}
                          </Typography>
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
                              onClick={() => handleEditLote(lote.id)}
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
                                onClick={() => handleDeleteClick(lote)}
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
                
              {filteredLotes.length === 0 && (
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
                        ? 'Nenhum lote encontrado para esta busca.' 
                        : 'Nenhum lote cadastrado.'}
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
          count={filteredLotes.length}
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
          Excluir Lote
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir o lote "{deleteDialog.loteInfo}"? Esta ação não pode ser desfeita.
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

export default LoteList;