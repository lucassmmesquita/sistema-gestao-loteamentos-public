import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchReajustes, fetchParametrosReajuste, aplicarReajuste, 
         simularReajuste, salvarParametrosReajuste } from '../services/reajusteService';
import { useSnackbar } from 'notistack';
import { useTheme } from '@mui/material/styles';

// Criação do contexto
const ReajusteContext = createContext();

// Provider component
export const ReajusteProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  
  // Estados
  const [reajustes, setReajustes] = useState([]);
  const [reajustesPendentes, setReajustesPendentes] = useState([]);
  const [reajustesAplicados, setReajustesAplicados] = useState([]);
  const [parametrosReajuste, setParametrosReajuste] = useState({
    indiceBase: 'IGPM',
    percentualAdicional: 6,
    intervaloParcelas: 12,
    alertaAntecipadoDias: 30
  });
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    cliente: '',
    contrato: '',
    status: 'todos',
    dataInicio: null,
    dataFim: null
  });

  // Carregar reajustes
  const carregarReajustes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchReajustes(filtros);
      setReajustes(data);
      
      // Separar reajustes pendentes e aplicados
      setReajustesPendentes(data.filter(r => r.status === 'pendente'));
      setReajustesAplicados(data.filter(r => r.status === 'aplicado'));
    } catch (error) {
      console.error('Erro ao carregar reajustes:', error);
      enqueueSnackbar('Erro ao carregar reajustes', { 
        variant: 'error',
        style: { backgroundColor: theme.palette.error.main }
      });
    } finally {
      setLoading(false);
    }
  }, [filtros, enqueueSnackbar, theme.palette.error.main]);

  // Carregar parâmetros de reajuste
  const carregarParametros = useCallback(async () => {
    try {
      const params = await fetchParametrosReajuste();
      setParametrosReajuste(params);
    } catch (error) {
      console.error('Erro ao carregar parâmetros de reajuste:', error);
      enqueueSnackbar('Erro ao carregar parâmetros de configuração', { 
        variant: 'error',
        style: { backgroundColor: theme.palette.error.main }
      });
    }
  }, [enqueueSnackbar, theme.palette.error.main]);

  // Executar reajuste
  const executarReajuste = useCallback(async (contratoId) => {
    setLoading(true);
    try {
      const resultado = await aplicarReajuste(contratoId);
      
      // Atualizar a lista de reajustes
      await carregarReajustes();
      
      enqueueSnackbar('Reajuste aplicado com sucesso', { 
        variant: 'success',
        style: { backgroundColor: theme.palette.success.main }
      });
      
      return resultado;
    } catch (error) {
      console.error('Erro ao aplicar reajuste:', error);
      enqueueSnackbar('Erro ao aplicar reajuste', { 
        variant: 'error',
        style: { backgroundColor: theme.palette.error.main }
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [carregarReajustes, enqueueSnackbar, theme.palette.success.main, theme.palette.error.main]);

  // Simular reajuste
  const executarSimulacao = useCallback(async (contratoId, parametros) => {
    try {
      return await simularReajuste(contratoId, parametros);
    } catch (error) {
      console.error('Erro ao simular reajuste:', error);
      enqueueSnackbar('Erro ao simular reajuste', { 
        variant: 'error',
        style: { backgroundColor: theme.palette.error.main }
      });
      throw error;
    }
  }, [enqueueSnackbar, theme.palette.error.main]);

  // Salvar parâmetros
  const salvarParametros = useCallback(async (novoParametros) => {
    try {
      await salvarParametrosReajuste(novoParametros);
      setParametrosReajuste(novoParametros);
      enqueueSnackbar('Parâmetros salvos com sucesso', { 
        variant: 'success',
        style: { backgroundColor: theme.palette.success.main }
      });
    } catch (error) {
      console.error('Erro ao salvar parâmetros:', error);
      enqueueSnackbar('Erro ao salvar parâmetros', { 
        variant: 'error',
        style: { backgroundColor: theme.palette.error.main }
      });
      throw error;
    }
  }, [enqueueSnackbar, theme.palette.success.main, theme.palette.error.main]);

  // Atualizar filtros
  const atualizarFiltros = useCallback((novosFiltros) => {
    setFiltros(prev => ({ ...prev, ...novosFiltros }));
  }, []);

  // Efeitos
  useEffect(() => {
    carregarParametros();
  }, [carregarParametros]);

  useEffect(() => {
    carregarReajustes();
  }, [carregarReajustes, filtros]);

  // Valor do contexto
  const contextValue = {
    reajustes,
    reajustesPendentes,
    reajustesAplicados,
    parametrosReajuste,
    loading,
    filtros,
    carregarReajustes,
    executarReajuste,
    executarSimulacao,
    salvarParametros,
    atualizarFiltros
  };

  return (
    <ReajusteContext.Provider value={contextValue}>
      {children}
    </ReajusteContext.Provider>
  );
};

// Hook para usar o contexto
export const useReajusteContext = () => {
  const context = useContext(ReajusteContext);
  if (!context) {
    throw new Error('useReajusteContext deve ser usado dentro de um ReajusteProvider');
  }
  return context;
};

export default ReajusteContext;