import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Grid, TextField, MenuItem, Button, 
  InputAdornment, IconButton, Collapse, Typography,
  useMediaQuery, Autocomplete
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { 
  FilterList, Search, Clear, ExpandMore, ExpandLess, 
  CalendarMonth, PersonSearch
} from '@mui/icons-material';
import { useReajusteContext } from '../../contexts/ReajusteContext';
import { format } from 'date-fns';
import axios from 'axios';

// URL base da API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Estilos personalizados
const FilterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const FilterHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const FilterTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
  fontWeight: 500,
}));

const FilterButton = styled(Button)(({ theme }) => ({
  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
  textTransform: 'none',
  borderRadius: '8px',
}));

// Componente principal
const FiltragemReajustes = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Context
  const { filtros, atualizarFiltros, carregarReajustes } = useReajusteContext();
  
  // Estados locais
  const [expanded, setExpanded] = useState(!isMobile);
  const [clientesOptions, setClientesOptions] = useState([]);
  const [contratosOptions, setContratosOptions] = useState([]);
  const [filtrosLocais, setFiltrosLocais] = useState({
    cliente: '',
    contrato: '',
    status: 'todos',
    dataInicio: null,
    dataFim: null
  });
  
  // Efeito para carregar opções de clientes e contratos
  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        // Carregar clientes
        const clientesResponse = await axios.get(`${API_URL}/clientes`);
        setClientesOptions(
          clientesResponse.data.map(cliente => ({
            id: cliente.id,
            label: `${cliente.nome} (${cliente.cpfCnpj})`,
            value: cliente.id
          }))
        );
        
        // Carregar contratos
        const contratosResponse = await axios.get(`${API_URL}/contratos?status=ativo`);
        setContratosOptions(
          contratosResponse.data.map(contrato => ({
            id: contrato.id,
            label: `Contrato #${contrato.numero}`,
            value: contrato.id
          }))
        );
      } catch (error) {
        console.error('Erro ao carregar opções:', error);
      }
    };
    
    carregarOpcoes();
  }, []);
  
  // Efeito para sincronizar com filtros do contexto
  useEffect(() => {
    setFiltrosLocais(filtros);
  }, [filtros]);
  
  // Handlers
  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };
  
  const handleFiltrosChange = (field) => (event, value) => {
    // Para autocomplete
    if (value !== undefined && typeof value === 'object') {
      setFiltrosLocais(prev => ({
        ...prev,
        [field]: value ? value.value : ''
      }));
      return;
    }
    
    // Para inputs normais
    const newValue = event.target.value;
    setFiltrosLocais(prev => ({
      ...prev,
      [field]: newValue
    }));
  };
  
  const handleDateChange = (field) => (event) => {
    const date = event.target.value ? new Date(event.target.value) : null;
    setFiltrosLocais(prev => ({
      ...prev,
      [field]: date
    }));
  };
  
  const handleAplicarFiltros = () => {
    atualizarFiltros(filtrosLocais);
    carregarReajustes();
  };
  
  const handleLimparFiltros = () => {
    const filtrosLimpos = {
      cliente: '',
      contrato: '',
      status: 'todos',
      dataInicio: null,
      dataFim: null
    };
    
    setFiltrosLocais(filtrosLimpos);
    atualizarFiltros(filtrosLimpos);
    carregarReajustes();
  };
  
  // Renderização condicional com base na responsividade
  return (
    <FilterPaper>
      <FilterHeader>
        <FilterTitle variant="subtitle1">
          <FilterList color="primary" />
          Filtrar Reajustes
        </FilterTitle>
        
        <Box>
          <IconButton 
            onClick={handleToggleExpand}
            aria-expanded={expanded}
            aria-label="expandir filtros"
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </FilterHeader>
      
      <Collapse in={expanded}>
        <Box component="form" noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                options={clientesOptions}
                getOptionLabel={(option) => {
                  return typeof option === 'string' ? option : option.label;
                }}
                onChange={(event, newValue) => {
                  setFiltrosLocais(prev => ({
                    ...prev,
                    cliente: newValue ? newValue.value : ''
                  }));
                }}
                value={clientesOptions.find(option => option.value === filtrosLocais.cliente) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Cliente"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <PersonSearch fontSize="small" />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                options={contratosOptions}
                getOptionLabel={(option) => {
                  return typeof option === 'string' ? option : option.label;
                }}
                onChange={(event, newValue) => {
                  setFiltrosLocais(prev => ({
                    ...prev,
                    contrato: newValue ? newValue.value : ''
                  }));
                }}
                value={contratosOptions.find(option => option.value === filtrosLocais.contrato) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Contrato"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <Search fontSize="small" />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Status"
                value={filtrosLocais.status}
                onChange={handleFiltrosChange('status')}
                variant="outlined"
                size="small"
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="pendente">Pendentes</MenuItem>
                <MenuItem value="aplicado">Aplicados</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Data Início"
                type="date"
                fullWidth
                size="small"
                value={filtrosLocais.dataInicio ? format(filtrosLocais.dataInicio, 'yyyy-MM-dd') : ''}
                onChange={handleDateChange('dataInicio')}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Data Fim"
                type="date"
                fullWidth
                size="small"
                value={filtrosLocais.dataFim ? format(filtrosLocais.dataFim, 'yyyy-MM-dd') : ''}
                onChange={handleDateChange('dataFim')}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonth fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
            <FilterButton 
              variant="outlined"
              onClick={handleLimparFiltros}
              startIcon={<Clear />}
            >
              Limpar
            </FilterButton>
            
            <FilterButton 
              variant="contained" 
              color="primary"
              onClick={handleAplicarFiltros}
              startIcon={<Search />}
            >
              Aplicar Filtros
            </FilterButton>
          </Box>
        </Box>
      </Collapse>
    </FilterPaper>
  );
};

export default FiltragemReajustes;