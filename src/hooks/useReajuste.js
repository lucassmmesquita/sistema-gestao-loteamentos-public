import { useState, useCallback, useEffect } from 'react';
import { useReajusteContext } from '../contexts/ReajusteContext';
import { 
  fetchHistoricoReajustes,
  fetchIndicesEconomicos
} from '../services/reajusteService';
import { 
  calcularHistoricoReajustes, 
  temReajusteIminente, 
  calcularDataProximoReajuste,
  formatarDescricaoReajuste
} from '../utils/calculoReajuste';
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
  
  // Calcular próximo reajuste
  const calcularProximoReajuste = useCallback((contrato) => {
    if (!contrato || !parametrosReajuste || !indicesEconomicos) {
      return null;
    }
    
    // Calcula a data do próximo reajuste
    const dataProximoReajuste = calcularDataProximoReajuste(contrato, parametrosReajuste);
    
    if (!dataProximoReajuste) {
      return null;
    }
    
    // Calcula a parcela correspondente ao próximo reajuste
    const proximaParcelaReajuste = Math.ceil((contrato.parcelasPagas + 1) / parametrosReajuste.intervaloParcelas) * parametrosReajuste.intervaloParcelas;
    
    // Se já passou a data, mas o reajuste não foi aplicado, marca como atrasado
    const hoje = new Date();
    const isAtrasado = isBefore(dataProximoReajuste, hoje);
    
    // Verifica se o reajuste está iminente (dentro do período de alerta)
    const isIminente = temReajusteIminente(contrato, parametrosReajuste);
    
    return {
      contratoId: contrato.id,
      dataReferencia: format(dataProximoReajuste, 'yyyy-MM-dd'),
      parcelaReferencia: proximaParcelaReajuste,
      isAtrasado,
      isIminente,
      status: 'pendente'
    };
  }, [parametrosReajuste, indicesEconomicos]);
  
  // Simular próximos reajustes
  const simularProximosReajustes = useCallback(async (contrato, qtdReajustes = 5) => {
    if (!contrato || !parametrosReajuste || !indicesEconomicos) {
      return [];
    }
    
    setSimulating(true);
    
    try {
      // Calcula o histórico de reajustes previstos
      const reajustesPrevistos = calcularHistoricoReajustes(
        contrato,
        parametrosReajuste,
        indicesEconomicos
      ).slice(0, qtdReajustes); // Limita a quantidade de reajustes retornados
      
      return reajustesPrevistos;
    } catch (err) {
      console.error('Erro ao simular próximos reajustes:', err);
      enqueueSnackbar('Erro ao simular próximos reajustes', { variant: 'error' });
      return [];
    } finally {
      setSimulating(false);
    }
  }, [parametrosReajuste, indicesEconomicos, enqueueSnackbar]);
  
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
  
  // Simular um reajuste específico
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
  
  // Verifica se o contrato pode ser reajustado
  const podeSerReajustado = useCallback((contrato) => {
    if (!contrato || !parametrosReajuste) {
      return false;
    }
    
    // Calcula a próxima parcela que deve ser reajustada
    const parcelasPagas = contrato.parcelasPagas || 0;
    const proximaParcelaReajuste = Math.ceil((parcelasPagas + 1) / parametrosReajuste.intervaloParcelas) * parametrosReajuste.intervaloParcelas;
    
    // Se a próxima parcela for maior que o total, não há mais reajustes
    if (proximaParcelaReajuste > contrato.totalParcelas) {
      return false;
    }
    
    return true;
  }, [parametrosReajuste]);
  
  // Formatar descrição do próximo reajuste
  const getDescricaoProximoReajuste = useCallback((contrato) => {
    if (!contrato || !proximoReajuste) {
      return 'Não há reajustes previstos para este contrato.';
    }
    
    const dataProximoReajuste = parseISO(proximoReajuste.dataReferencia);
    
    // Se o reajuste estiver atrasado
    if (proximoReajuste.isAtrasado) {
      return `Reajuste ATRASADO! Deveria ter sido aplicado na parcela ${proximoReajuste.parcelaReferencia} em ${format(dataProximoReajuste, 'dd/MM/yyyy')}.`;
    }
    
    // Se o reajuste estiver iminente
    if (proximoReajuste.isIminente) {
      return `Reajuste IMINENTE! Será aplicado na parcela ${proximoReajuste.parcelaReferencia} em ${format(dataProximoReajuste, 'dd/MM/yyyy')}.`;
    }
    
    // Reajuste normal
    return `Próximo reajuste previsto para a parcela ${proximoReajuste.parcelaReferencia} em ${format(dataProximoReajuste, 'dd/MM/yyyy')}.`;
  }, [proximoReajuste]);
  
  // Efeitos
  useEffect(() => {
    if (contratoId) {
      carregarHistoricoReajustes();
      carregarIndicesEconomicos();
    }
  }, [contratoId, carregarHistoricoReajustes, carregarIndicesEconomicos]);
  
  return {
    historicoReajustes,
    proximoReajuste,
    indicesEconomicos,
    loading,
    simulating,
    error,
    carregarHistoricoReajustes,
    calcularProximoReajuste,
    simularProximosReajustes,
    aplicarReajuste,
    simularReajuste,
    podeSerReajustado,
    getDescricaoProximoReajuste
  };
};

export default useReajuste;