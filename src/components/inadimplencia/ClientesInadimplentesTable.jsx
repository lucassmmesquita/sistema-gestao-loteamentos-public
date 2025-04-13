import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Collapse,
  IconButton,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  FilterList,
  Search,
  Clear,
  KeyboardArrowDown,
  KeyboardArrowUp,
  FileDownload,
  WhatsApp,
  Email,
  Sms,
  Refresh,
  MoreVert
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { useInadimplencia } from '../../hooks/useInadimplencia';
import StatusPagamento from './StatusPagamento';

// Componente de cabeçalho da tabela com ordenação
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, isMobile } = props;
  
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  
  // Definição das colunas da tabela
  const headCells = [
    { id: 'cliente', label: 'Cliente', disablePadding: false, sortable: true },
    { id: 'contrato', label: 'Contrato', disablePadding: false, sortable: true, hideOnMobile: true },
    { id: 'valorEmAberto', label: 'Valor em Aberto', disablePadding: false, sortable: true },
    { id: 'diasAtraso', label: 'Dias de Atraso', disablePadding: false, sortable: true },
    { id: 'ultimaCobranca', label: 'Última Cobrança', disablePadding: false, sortable: true, hideOnMobile: true },
    { id: 'status', label: 'Status', disablePadding: false, sortable: true },
    { id: 'acoes', label: 'Ações', disablePadding: false, sortable: false },
  ];
  
  // Filtrar colunas para mobile
  const visibleHeadCells = isMobile
    ? headCells.filter(cell => !cell.hideOnMobile)
    : headCells;

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: theme => theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.05)' }}>
        <TableCell padding="checkbox" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          {/* Célula vazia para o botão de expansão */}
        </TableCell>
        {visibleHeadCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              fontWeight: 600,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
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
  );
}

// Componente de linha detalhada
function Row(props) {
  const { row, isMobile } = props;
  const [open, setOpen] = useState(false);
  const { formatarValor, calcularDiasAtraso } = useInadimplencia();
  const theme = useTheme();
  
  return (
    <>
      <TableRow 
        hover 
        sx={{ 
          '&:hover': { 
            backgroundColor: theme => theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.04)' 
              : 'rgba(255, 255, 255, 0.08)' 
          } 
        }}
      >
        <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <IconButton
            aria-label="expandir linha"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ transition: 'transform 0.2s' }}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell 
          component="th" 
          scope="row"
          sx={{ 
            fontWeight: 500,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          {row.cliente.nome}
        </TableCell>
        {!isMobile && (
          <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            {row.contrato.numero}
          </TableCell>
        )}
        <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          {formatarValor(row.valorEmAberto)}
        </TableCell>
        <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Chip 
            label={`${row.diasAtraso} dias`} 
            color={
              row.diasAtraso > 30 ? 'error' : 
              row.diasAtraso > 15 ? 'warning' : 
              'info'
            }
            size="small"
            sx={{ 
              fontWeight: 500,
              boxShadow: 'none',
              borderRadius: 4
            }}
          />
        </TableCell>
        {!isMobile && (
          <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            {row.ultimaCobranca ? format(new Date(row.ultimaCobranca), 'dd/MM/yyyy') : 'Não realizada'}
          </TableCell>
        )}
        <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <StatusPagamento status={row.status} />
        </TableCell>
        <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Enviar WhatsApp">
              <IconButton 
                size="small" 
                color="primary"
                sx={{ 
                  '&:hover': { 
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s ease' 
                  } 
                }}
              >
                <WhatsApp fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Enviar Email">
              <IconButton 
                size="small" 
                color="primary"
                sx={{ 
                  '&:hover': { 
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s ease' 
                  } 
                }}
              >
                <Email fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Mais ações">
              <IconButton 
                size="small" 
                component={Link} 
                to={`/inadimplencia/cliente/${row.cliente.id}`}
                sx={{ 
                  '&:hover': { 
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s ease' 
                  } 
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={isMobile ? 5 : 8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                component="div" 
                sx={{ 
                  fontSize: '1rem', 
                  fontWeight: 600,
                  color: theme.palette.primary.main
                }}
              >
                Parcelas em Atraso
              </Typography>
              <Table size="small" aria-label="parcelas">
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme => theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.05)' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Nº Parcela</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Vencimento</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Valor</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Dias em Atraso</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.parcelas.map((parcela) => (
                    <TableRow key={parcela.id}>
                      <TableCell>{parcela.numero}</TableCell>
                      <TableCell>{format(new Date(parcela.dataVencimento), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{formatarValor(parcela.valor)}</TableCell>
                      <TableCell>{calcularDiasAtraso(parcela.dataVencimento)}</TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="primary"
                          component={Link}
                          to={`/inadimplencia/cliente/${row.cliente.id}?parcela=${parcela.id}`}
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
                          Gerenciar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// Componente principal da tabela
const ClientesInadimplentesTable = () => {
  const {
    clientesInadimplentes,
    loading,
    error,
    filtros,
    atualizarFiltros,
    limparFiltros,
    carregarClientesInadimplentes,
    exportarParaExcel,
    exportarParaPDF
  } = useInadimplencia();
  
  // Estados locais
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('cliente');
  const [showFilters, setShowFilters] = useState(false);
  
  // Detectar tamanho da tela
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Função de ordenação
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  // Funções de paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Função para atualizar filtro
  const handleFiltroChange = (campo) => (event) => {
    const valor = event.target.value;
    atualizarFiltros({ [campo]: valor });
  };
  
  // Função para atualizar filtro de data
  const handleDataChange = (campo) => (date) => {
    atualizarFiltros({ [campo]: date ? format(date, 'yyyy-MM-dd') : '' });
  };
  
  // Busca os dados quando os filtros mudarem
  useEffect(() => {
    carregarClientesInadimplentes();
  }, [carregarClientesInadimplentes]);
  
  // Ordenação dos dados
  const sortedData = React.useMemo(() => {
    if (!clientesInadimplentes) return [];
    
    return [...clientesInadimplentes].sort((a, b) => {
      let comparador = 0;
      
      if (orderBy === 'cliente') {
        comparador = a.cliente.nome.localeCompare(b.cliente.nome);
      } else if (orderBy === 'contrato') {
        comparador = a.contrato.numero.localeCompare(b.contrato.numero);
      } else if (orderBy === 'valorEmAberto') {
        comparador = a.valorEmAberto - b.valorEmAberto;
      } else if (orderBy === 'diasAtraso') {
        comparador = a.diasAtraso - b.diasAtraso;
      } else if (orderBy === 'ultimaCobranca') {
        // Ordenar por data, tratar casos em que ultimaCobranca pode ser null
        if (!a.ultimaCobranca && !b.ultimaCobranca) comparador = 0;
        else if (!a.ultimaCobranca) comparador = 1;
        else if (!b.ultimaCobranca) comparador = -1;
        else comparador = new Date(a.ultimaCobranca) - new Date(b.ultimaCobranca);
      } else if (orderBy === 'status') {
        comparador = a.status.localeCompare(b.status);
      }
      
      return order === 'desc' ? -comparador : comparador;
    });
  }, [clientesInadimplentes, order, orderBy]);
  
  // Paginação e slicing dos dados
  const paginatedData = React.useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);
  
  // Manipuladores para exportação
  const handleExportExcel = async () => {
    const result = await exportarParaExcel();
    // Adicionar notificação baseada no resultado
  };
  
  const handleExportPDF = async () => {
    const result = await exportarParaPDF();
    // Adicionar notificação baseada no resultado
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Paper 
        sx={{ 
          width: '100%', 
          mb: 2, 
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: 2
        }} 
        elevation={2}
      >
        {/* Cabeçalho com título e ações */}
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontWeight: 600,
              fontSize: '1.125rem'
            }}
          >
            Clientes Inadimplentes
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
              size={isMobile ? "small" : "medium"}
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
              Filtros
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={handleExportExcel}
              size={isMobile ? "small" : "medium"}
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
              Excel
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={handleExportPDF}
              size={isMobile ? "small" : "medium"}
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
              PDF
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={() => carregarClientesInadimplentes()}
              size={isMobile ? "small" : "medium"}
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
              Atualizar
            </Button>
          </Box>
        </Box>
        
        {/* Seção de filtros */}
        <Collapse in={showFilters}>
          <Card variant="outlined" sx={{ m: 2, borderRadius: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    label="Status de Pagamento"
                    fullWidth
                    value={filtros.statusPagamento}
                    onChange={handleFiltroChange('statusPagamento')}
                    margin="normal"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="em_aberto">Em Aberto</MenuItem>
                    <MenuItem value="parcial">Parcial</MenuItem>
                    <MenuItem value="pago">Pago</MenuItem>
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Contrato"
                    fullWidth
                    value={filtros.contratoId}
                    onChange={handleFiltroChange('contratoId')}
                    margin="normal"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Valor Mínimo"
                    fullWidth
                    value={filtros.valorMinimo}
                    onChange={handleFiltroChange('valorMinimo')}
                    margin="normal"
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Valor Máximo"
                    fullWidth
                    value={filtros.valorMaximo}
                    onChange={handleFiltroChange('valorMaximo')}
                    margin="normal"
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Atraso Mínimo (dias)"
                    fullWidth
                    type="number"
                    value={filtros.diasAtrasoMin}
                    onChange={handleFiltroChange('diasAtrasoMin')}
                    margin="normal"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Atraso Máximo (dias)"
                    fullWidth
                    type="number"
                    value={filtros.diasAtrasoMax}
                    onChange={handleFiltroChange('diasAtrasoMax')}
                    margin="normal"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                    <DatePicker
                      label="Última Cobrança (Início)"
                      value={filtros.dataUltimaCobrancaInicio ? new Date(filtros.dataUltimaCobrancaInicio) : null}
                      onChange={handleDataChange('dataUltimaCobrancaInicio')}
                      renderInput={(params) => <TextField {...params} fullWidth margin="normal" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                    <DatePicker
                      label="Última Cobrança (Fim)"
                      value={filtros.dataUltimaCobrancaFim ? new Date(filtros.dataUltimaCobrancaFim) : null}
                      onChange={handleDataChange('dataUltimaCobrancaFim')}
                      renderInput={(params) => <TextField {...params} fullWidth margin="normal" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={limparFiltros}
                  size="small"
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
                  Limpar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={() => {
                    carregarClientesInadimplentes();
                    setShowFilters(false);
                  }}
                  size="small"
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
                  Buscar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Collapse>
        
        {/* Tabela */}
        <TableContainer sx={{ maxHeight: '60vh' }}>
          <Table
            sx={{ minWidth: isMobile ? 300 : 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              isMobile={isMobile}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={isMobile ? 5 : 8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={40} />
                    <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                      Carregando dados...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isMobile ? 5 : 8} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ color: 'text.secondary' }}>
                      Nenhum cliente inadimplente encontrado
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <Row key={row.cliente.id} row={row} isMobile={isMobile} />
                ))
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={isMobile ? 5 : 8} align="center" sx={{ py: 4 }}>
                    <Alert severity="error" sx={{ width: 'fit-content', mx: 'auto' }}>
                      {error}
                    </Alert>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Paginação */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={isMobile ? "Linhas:" : "Linhas por página:"}
          sx={{ 
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        />
      </Paper>
    </Box>
  );
};

export default ClientesInadimplentesTable;