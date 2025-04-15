import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon 
} from '@mui/icons-material';
import useClientes from '../../hooks/useClientes';
import useContratos from '../../hooks/useContratos';
import { formatCurrency } from '../../utils/formatters';
import Loading from '../common/Loading';

const VincularContrato = ({ onVincular, contratoId = null }) => {
  const { clientes, loading: clientesLoading } = useClientes();
  const { lotes, contratos, loading: contratosLoading } = useContratos();
  
  // Component states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedContrato, setSelectedContrato] = useState(null);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [clienteContratos, setClienteContratos] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Filter clients based on search term
  useEffect(() => {
    if (clientes && searchTerm) {
      const filtered = clientes.filter(cliente => 
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cpfCnpj.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClientes(filtered);
    } else {
      setFilteredClientes([]);
    }
  }, [searchTerm, clientes]);
  
  // Get client contracts when client is selected
  useEffect(() => {
    if (selectedCliente) {
      const clientContracts = contratos.filter(
        contrato => contrato.clienteId === selectedCliente.id
      );
      
      // Add lote information to each contract
      const contractsWithLoteInfo = clientContracts.map(contrato => {
        const lote = lotes.find(l => l.id === contrato.loteId);
        return {
          ...contrato,
          loteInfo: lote ? {
            loteamento: lote.loteamento,
            quadra: lote.quadra,
            numero: lote.numero,
            area: lote.area
          } : null
        };
      });
      
      setClienteContratos(contractsWithLoteInfo);
    } else {
      setClienteContratos([]);
    }
  }, [selectedCliente, contratos, lotes]);
  
  // Handle client selection
  const handleClienteSelect = (cliente) => {
    setSelectedCliente(cliente);
    setSearchTerm('');
    setFilteredClientes([]);
    setSelectedContrato(null);
  };
  
  // Handle contract selection
  const handleContratoSelect = (contrato) => {
    setSelectedContrato(contrato);
  };
  
  // Open confirm dialog
  const handleConfirmOpen = () => {
    if (!selectedContrato) {
      setErrorMessage('Selecione um contrato para vincular');
      return;
    }
    
    setErrorMessage('');
    setConfirmDialogOpen(true);
  };
  
  // Close confirm dialog
  const handleConfirmClose = () => {
    setConfirmDialogOpen(false);
  };
  
  // Handle contract linking
  const handleVincular = () => {
    if (onVincular && selectedContrato) {
      onVincular(selectedContrato);
    }
    handleConfirmClose();
  };
  
  // Reset selection
  const handleReset = () => {
    setSelectedCliente(null);
    setSelectedContrato(null);
    setSearchTerm('');
    setFilteredClientes([]);
    setErrorMessage('');
  };
  
  return (
    <>
      <Loading open={clientesLoading || contratosLoading} />
      
      <Paper sx={{ p: 3, mb: 2 }}>
        {!selectedCliente ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Buscar Cliente
            </Typography>
            
            <TextField
              fullWidth
              label="Buscar por nome ou CPF/CNPJ"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ mb: 2 }}
            />
            
            {filteredClientes.length > 0 && (
              <List sx={{ maxHeight: 300, overflow: 'auto', bgcolor: 'background.paper', borderRadius: 1 }}>
                {filteredClientes.map((cliente) => (
                  <ListItem 
                    key={cliente.id} 
                    button 
                    onClick={() => handleClienteSelect(cliente)}
                    divider
                  >
                    <ListItemText
                      primary={cliente.nome}
                      secondary={cliente.cpfCnpj}
                    />
                  </ListItem>
                ))}
              </List>
            )}
            
            {searchTerm && filteredClientes.length === 0 && (
              <Alert severity="info">
                Nenhum cliente encontrado com este termo de busca.
              </Alert>
            )}
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Cliente Selecionado
              </Typography>
              
              <Button 
                variant="outlined"
                size="small"
                onClick={handleReset}
              >
                Alterar Cliente
              </Button>
            </Box>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nome
                  </Typography>
                  <Typography variant="body1">
                    {selectedCliente.nome}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    CPF/CNPJ
                  </Typography>
                  <Typography variant="body1">
                    {selectedCliente.cpfCnpj}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Typography variant="h6" gutterBottom>
              Contratos do Cliente
            </Typography>
            
            {clienteContratos.length > 0 ? (
              <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                {clienteContratos.map((contrato) => (
                  <ListItem
                    key={contrato.id}
                    button
                    selected={selectedContrato?.id === contrato.id}
                    onClick={() => handleContratoSelect(contrato)}
                    divider
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        '&:hover': {
                          bgcolor: 'primary.light',
                        }
                      }
                    }}
                  >
                    <ListItemIcon>
                      {selectedContrato?.id === contrato.id ? (
                        <CheckCircleIcon color="primary" />
                      ) : null}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={500}>
                          {contrato.loteInfo ? 
                            `${contrato.loteInfo.loteamento} - Quadra ${contrato.loteInfo.quadra}, Lote ${contrato.loteInfo.numero}` : 
                            `Contrato #${contrato.id}`
                          }
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            Valor: {formatCurrency(contrato.valorTotal)}
                          </Typography>
                          <Typography variant="body2" component="span" sx={{ ml: 2 }}>
                            Parcelas: {contrato.numeroParcelas}x
                          </Typography>
                        </>
                      }
                    />
                    
                    <Chip 
                      label={contrato.status || 'Ativo'} 
                      color={contrato.status === 'cancelado' ? 'error' : 'primary'} 
                      size="small" 
                      sx={{ ml: 2 }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info">
                Este cliente não possui contratos.
              </Alert>
            )}
            
            {errorMessage && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmOpen}
                disabled={!selectedContrato}
              >
                Vincular Contrato
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleConfirmClose}
      >
        <DialogTitle>Confirmar Vinculação</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Deseja vincular o contrato selecionado?
          </Typography>
          {selectedContrato && selectedContrato.loteInfo && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Cliente: {selectedCliente?.nome}
              </Typography>
              <Typography variant="body2">
                Lote: {selectedContrato.loteInfo.loteamento} - Quadra {selectedContrato.loteInfo.quadra}, Lote {selectedContrato.loteInfo.numero}
              </Typography>
              <Typography variant="body2">
                Valor: {formatCurrency(selectedContrato.valorTotal)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Cancelar</Button>
          <Button onClick={handleVincular} color="primary" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VincularContrato;