import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Paper, Chip, IconButton, Button, Typography, Box, Tooltip, CircularProgress,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  Visibility, CheckCircle, WarningAmber, FileDownload,
  PictureAsPdf, CalculateOutlined, AttachMoney
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DetalheReajuste from './DetalheReajuste';

// Estilos personalizados
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  maxHeight: 600,
  border: `1px solid ${theme.palette.divider}`,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.5) 
    : alpha(theme.palette.background.paper, 0.7),
  '& .MuiTableCell-head': {
    fontWeight: 600,
    color: theme.palette.text.primary,
    fontSize: '0.875rem',
    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.action.hover, 0.05) 
      : alpha(theme.palette.action.hover, 0.05),
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.action.hover, 0.1) 
      : alpha(theme.palette.action.hover, 0.1),
  },
  '& .MuiTableCell-root': {
    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
  }
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 16,
  fontWeight: 500,
  backgroundColor: status === 'pendente' 
    ? alpha(theme.palette.warning.main, 0.1) 
    : status === 'aplicado' 
      ? alpha(theme.palette.success.main, 0.1) 
      : alpha(theme.palette.grey[500], 0.1),
  color: status === 'pendente' 
    ? theme.palette.warning.dark 
    : status === 'aplicado' 
      ? theme.palette.success.dark 
      : theme.palette.grey[700],
  border: `1px solid ${
    status === 'pendente' 
      ? alpha(theme.palette.warning.main, 0.2) 
      : status === 'aplicado' 
        ? alpha(theme.palette.success.main, 0.2) 
        : alpha(theme.palette.grey[500], 0.2)
  }`,
  '& .MuiChip-icon': {
    color: 'inherit',
  },
}));

const EmptyStateBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  height: 300,
  textAlign: 'center',
}));

const TableActionsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(1),
}));

// Componente principal
const LogReajustesTable = ({ reajustes, loading, executarReajuste }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // Estados
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [reajusteSelecionado, setReajusteSelecionado] = useState(null);
  const [modalDetalheOpen, setModalDetalheOpen] = useState(false);
  
  // Handlers de paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Abrir detalhe do reajuste
  const handleOpenDetalhe = (reajuste) => {
    setReajusteSelecionado(reajuste);
    setModalDetalheOpen(true);
  };
  
  // Fechar detalhe do reajuste
  const handleCloseDetalhe = () => {
    setModalDetalheOpen(false);
    setReajusteSelecionado(null);
  };
  
  // Aplicar reajuste
  const handleAplicarReajuste = async (contratoId) => {
    await executarReajuste(contratoId);
    handleCloseDetalhe();
  };
  
  // Formatar valores para exibição
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };
  
  const formatarData = (data) => {
    if (!data) return '';
    const dataObj = typeof data === 'string' ? parseISO(data) : data;
    return format(dataObj, 'dd/MM/yyyy', { locale: ptBR });
  };
  
  const formatarPercentual = (valor) => {
    return `${valor.toFixed(2)}%`;
  };
  
  // Verificar se não há reajustes
  const semReajustes = reajustes.length === 0 && !loading;
  
  // Calcular quantidade de itens para paginação
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - reajustes.length) : 0;
  
  return (
    <>
      <TableActionsBox>
        <Button 
          variant="outlined" 
          startIcon={<FileDownload />}
          disabled={reajustes.length === 0 || loading}
          sx={{ borderRadius: '8px', textTransform: 'none' }}
        >
          Exportar Log
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<PictureAsPdf />}
          disabled={reajustes.length === 0 || loading}
          sx={{ borderRadius: '8px', textTransform: 'none' }}
        >
          Gerar Relatório
        </Button>
      </TableActionsBox>
    
      <StyledTableContainer component={Paper}>
        {loading ? (
          <EmptyStateBox>
            <CircularProgress size={40} />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Carregando reajustes...
            </Typography>
          </EmptyStateBox>
        ) : semReajustes ? (
          <EmptyStateBox>
            <CalculateOutlined sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Nenhum reajuste encontrado
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Não há registros de reajustes com os filtros atuais.
            </Typography>
          </EmptyStateBox>
        ) : (
          <>
            <Table stickyHeader aria-label="tabela de reajustes">
              <StyledTableHead>
                <TableRow>
                  <TableCell>Contrato</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Data Referência</TableCell>
                  <TableCell>Parcela</TableCell>
                  <TableCell>Valor Original</TableCell>
                  <TableCell>Valor Reajustado</TableCell>
                  <TableCell>Índice</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {reajustes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((reajuste) => (
                    <StyledTableRow key={reajuste.id}>
                      <TableCell>
                    {reajuste.contrato?.numero || 
                    (reajuste.contratoId ? `#${reajuste.contratoId}` : 'Não identificado')}
                    </TableCell>
                      <TableCell>
                        {reajuste.cliente?.nome || 'Não informado'}
                      </TableCell>
                      <TableCell>
                        {formatarData(reajuste.dataReferencia)}
                      </TableCell>
                      <TableCell>
                        {reajuste.parcelaReferencia}
                      </TableCell>
                      <TableCell>
                        {formatarValor(reajuste.valorOriginal)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {formatarValor(reajuste.valorReajustado)}
                          <Tooltip title={`Diferença: ${formatarValor(reajuste.valorReajustado - reajuste.valorOriginal)}`}>
                            <AttachMoney 
                              color="primary" 
                              fontSize="small" 
                              sx={{ ml: 0.5, opacity: 0.7 }} 
                            />
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={`${reajuste.indiceBase || 'IGPM'}: ${formatarPercentual(reajuste.indiceAplicado)} + ${formatarPercentual(reajuste.percentualAdicional)}`}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {formatarPercentual(reajuste.reajusteTotal)}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <StatusChip 
                          label={reajuste.status === 'aplicado' ? 'Aplicado' : 'Pendente'}
                          status={reajuste.status || 'pendente'}
                          icon={reajuste.status === 'aplicado' ? <CheckCircle fontSize="small" /> : <WarningAmber fontSize="small" />}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver detalhes">
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpenDetalhe(reajuste)}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {reajuste.status !== 'aplicado' && (
                          <Tooltip title="Aplicar reajuste">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleAplicarReajuste(reajuste.contratoId)}
                            >
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </StyledTableRow>
                  ))}
                  
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={9} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={reajustes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Itens por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </>
        )}
      </StyledTableContainer>
      
      <DetalheReajuste 
        open={modalDetalheOpen}
        onClose={handleCloseDetalhe}
        reajuste={reajusteSelecionado}
        onAplicar={handleAplicarReajuste}
      />
    </>
  );
};

export default LogReajustesTable;