// src/components/inadimplencia/ClientesInadimplentesTable.jsx
import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Button
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useInadimplenciaContext } from '../../contexts/InadimplenciaContext';

// Componente para renderizar cada linha da tabela de forma segura
// src/components/inadimplencia/ClientesInadimplentesTable.jsx

// Na função Row, vamos modificar como o nome do cliente é exibido
const Row = ({ cliente, index, onViewClick, onSendEmailClick, formatarValor }) => {
  const { calcularDiasAtraso } = useInadimplenciaContext() || {};
  
  // Verificação de segurança para evitar erro de propriedades indefinidas
  if (!cliente) return null;
  
  // Verificação segura para parcelas
  const parcelas = Array.isArray(cliente.parcelas) ? cliente.parcelas : [];
  
  // Função para formatar datas
  const formatarData = (data) => {
    if (!data) return '-';
    
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) return '-';
    
    return dataObj.toLocaleDateString('pt-BR');
  };
  
  // Cálculo do valor total das parcelas com verificação segura
  const valorTotal = parcelas.reduce((total, parcela) => {
    if (!parcela || isNaN(parseFloat(parcela.valorAtualizado))) return total;
    return total + parseFloat(parcela.valorAtualizado);
  }, 0);
  
  // Dias em atraso - Calculando manualmente quando calcularDiasAtraso não estiver disponível
  let diasAtraso = 0;
  if (parcelas.length > 0) {
    // Encontrar a parcela mais antiga de forma segura
    const parcelasMaisAntigas = parcelas
      .filter(parcela => parcela && parcela.dataVencimento)
      .sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));
    
    if (parcelasMaisAntigas.length > 0) {
      const parcelaMaisAntiga = parcelasMaisAntigas[0];
      
      if (typeof calcularDiasAtraso === 'function') {
        diasAtraso = calcularDiasAtraso(parcelaMaisAntiga.dataVencimento);
      } else {
        // Cálculo manual como backup
        const hoje = new Date();
        const dataVencimento = new Date(parcelaMaisAntiga.dataVencimento);
        diasAtraso = Math.floor((hoje - dataVencimento) / (1000 * 60 * 60 * 24));
        if (diasAtraso < 0) diasAtraso = 0;
      }
    }
  }
  
  return (
    <TableRow hover>
      <TableCell>
        {/* Exibir o nome completo do cliente sem limitação */}
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {cliente.nome || `Cliente ${index + 1}`}
        </Typography>
      </TableCell>
      <TableCell align="center">{parcelas.length}</TableCell>
      <TableCell>{formatarValor(valorTotal)}</TableCell>
      <TableCell align="center">
        <Chip 
          label={`${diasAtraso} dias`}
          color={
            diasAtraso > 90 ? 'error' :
            diasAtraso > 60 ? 'warning' :
            diasAtraso > 30 ? 'info' : 'default'
          }
          size="small"
        />
      </TableCell>
      <TableCell>{formatarData(cliente.ultimaCobranca)}</TableCell>
      <TableCell align="center">
        <Chip 
          label={cliente.status || 'Pendente'}
          color={
            cliente.status === 'Negociando' ? 'info' :
            cliente.status === 'Notificado' ? 'warning' :
            cliente.status === 'Em Cobrança' ? 'error' : 'default'
          }
          size="small"
        />
      </TableCell>
      <TableCell align="center">
        <IconButton 
          color="primary" 
          size="small"
          onClick={() => onViewClick && onViewClick(cliente)}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
        <IconButton 
          color="secondary" 
          size="small"
          onClick={() => onSendEmailClick && onSendEmailClick(cliente)}
        >
          <EmailIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const ClientesInadimplentesTable = ({ formatarValor }) => {
  const navigate = useNavigate();
  const { 
    clientesInadimplentes, 
    filtros, 
    atualizarFiltros, 
    carregarClientesInadimplentes
  } = useInadimplenciaContext() || {};
  const [busca, setBusca] = useState('');
  
  // Implementação local de formatarValor se não for passado como prop
  const formatarValorLocal = formatarValor || ((valor) => {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  });
  
  // Funções para manipular ações
  const handleViewClick = (cliente) => {
    if (cliente && cliente.id) {
      navigate(`/inadimplencia/cliente/${cliente.id}`);
    }
  };
  
  const handleSendEmailClick = (cliente) => {
    if (cliente && cliente.id) {
      navigate(`/inadimplencia/enviar-cobranca/${cliente.id}`);
    }
  };
  
  // Filtrar clientes pela busca local
  const handleSearchChange = (e) => {
    setBusca(e.target.value);
    if (atualizarFiltros) {
      atualizarFiltros({ busca: e.target.value });
    }
  };
  
  const handleClearSearch = () => {
    setBusca('');
    if (atualizarFiltros) {
      atualizarFiltros({ busca: '' });
    }
  };
  
  // Forçar nova requisição para atualizar dados
  const handleRefresh = () => {
    if (carregarClientesInadimplentes) {
      carregarClientesInadimplentes();
    }
  };
  
  // Garantir que clientesInadimplentes é um array
  const clientes = Array.isArray(clientesInadimplentes) ? clientesInadimplentes : [];
  
  return (
    <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 2, pb: 1, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Buscar cliente..."
          variant="outlined"
          size="small"
          value={busca}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: busca && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          sx={{ minWidth: 120 }}
        >
          Atualizar
        </Button>
      </Box>
      
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="tabela de clientes inadimplentes">
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell align="center">Parcelas</TableCell>
              <TableCell>Valor em Aberto</TableCell>
              <TableCell align="center">Dias em Atraso</TableCell>
              <TableCell>Última Cobrança</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 3 }}>
                    Nenhum cliente inadimplente encontrado.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((cliente, index) => (
                <Row 
                  key={cliente?.id || index}
                  cliente={cliente}
                  index={index}
                  onViewClick={handleViewClick}
                  onSendEmailClick={handleSendEmailClick}
                  formatarValor={formatarValorLocal}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ClientesInadimplentesTable;