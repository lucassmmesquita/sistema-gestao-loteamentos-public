// src/hooks/useReajuste.js

import { useState, useCallback, useEffect } from 'react';
import { useReajusteContext } from '../contexts/ReajusteContext';
import { 
  fetchHistoricoReajustes,
  fetchIndicesEconomicos
} from '../services/reajusteService';
import { useSnackbar } from 'notistack';
import { format, addMonths, isBefore, parseISO } from 'date-fns';

/**
 * Hook personalizado para gestão de reajustes de um contrato específico
 * @param {string} contratoId - ID do contrato
 * @returns {Object} Objeto com funções e estados para gestão de reajustes
 */
const useReajuste = (contratoId) => {
  const { enqueueSnackbar } = useSnackbar();
  const { parametrosReajuste, executarReajuste, executarSimulacao } = useReajusteContext();
  
  // Estados
  const [historicoReajustes, setHistoricoReajustes] = useState([]);
  const [proximoReajuste, setProximoReajuste] = useState(null);
  const [indicesEconomicos, setIndicesEconomicos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState(null);
  
  // Carregar histórico de reajustes
  const carregarHistoricoReajustes = useCallback(async () => {
    if (!contratoId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const historico = await fetchHistoricoReajustes(contratoId);
      setHistoricoReajustes(historico);
    } catch (err) {
      console.error('Erro ao carregar histórico de reajustes:', err);
      setError('Não foi possível carregar o histórico de reajustes.');
      enqueueSnackbar('Erro ao carregar histórico de reajustes', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [contratoId, enqueueSnackbar]);
  
  // Carregar índices econômicos
  const carregarIndicesEconomicos = useCallback(async () => {
    try {
      const indices = await fetchIndicesEconomicos();
      setIndicesEconomicos(indices);
    } catch (err) {
      console.error('Erro ao carregar índices econômicos:', err);
      enqueueSnackbar('Erro ao carregar índices econômicos', { variant: 'error' });
    }
  }, [enqueueSnackbar]);
  
  // Efeitos
  useEffect(() => {
    if (contratoId) {
      carregarHistoricoReajustes();
      carregarIndicesEconomicos();
    }
  }, [contratoId, carregarHistoricoReajustes, carregarIndicesEconomicos]);
  
  // Aplicar reajuste
  const aplicarReajuste = useCallback(async () => {
    if (!contratoId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await executarReajuste(contratoId);
      
      // Atualiza o histórico de reajustes
      await carregarHistoricoReajustes();
      
      enqueueSnackbar('Reajuste aplicado com sucesso', { variant: 'success' });
      return resultado;
    } catch (err) {
      console.error('Erro ao aplicar reajuste:', err);
      setError('Não foi possível aplicar o reajuste.');
      enqueueSnackbar('Erro ao aplicar reajuste', { variant: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [contratoId, executarReajuste, carregarHistoricoReajustes, enqueueSnackbar]);
  
  // Simular reajuste
  const simularReajuste = useCallback(async (parametrosOverride = {}) => {
    if (!contratoId) return null;
    
    setSimulating(true);
    
    try {
      const resultado = await executarSimulacao(contratoId, parametrosOverride);
      return resultado;
    } catch (err) {
      console.error('Erro ao simular reajuste:', err);
      enqueueSnackbar('Erro ao simular reajuste', { variant: 'error' });
      return null;
    } finally {
      setSimulating(false);
    }
  }, [contratoId, executarSimulacao, enqueueSnackbar]);
  
  return {
    historicoReajustes,
    proximoReajuste,
    indicesEconomicos,
    loading,
    simulating,
    error,
    carregarHistoricoReajustes,
    carregarIndicesEconomicos,
    aplicarReajuste,
    simularReajuste
  };
};

export default useReajuste;