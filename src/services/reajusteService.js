// src/services/reajusteService.js

import api from './api';

/**
 * Busca todos os reajustes com base nos filtros
 * @param {Object} filtros - Filtros para a busca
 * @returns {Promise<Array>} Lista de reajustes
 */
export const fetchReajustes = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Aplica filtros
    if (filtros.cliente) params.append('clienteId', filtros.cliente);
    if (filtros.contrato) params.append('contratoId', filtros.contrato);
    if (filtros.status && filtros.status !== 'todos') params.append('status', filtros.status);
    
    // Filtros de data
    if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
    
    // Envia requisição com os parâmetros
    const response = await api.get(`/reajustes?${params}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar reajustes:', error);
    throw new Error('Não foi possível carregar os reajustes. Tente novamente mais tarde.');
  }
};

/**
 * Busca os contratos com reajustes previstos para o período
 * @param {Date} dataInicio - Data de início do período
 * @param {Date} dataFim - Data de fim do período
 * @returns {Promise<Array>} Lista de contratos com reajustes previstos
 */
export const fetchReajustesPrevistos = async (dataInicio, dataFim) => {
  try {
    const params = new URLSearchParams();
    
    if (dataInicio) params.append('dataInicio', dataInicio.toISOString());
    if (dataFim) params.append('dataFim', dataFim.toISOString());
    
    const response = await api.get(`/reajustes/previstos?${params}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar reajustes previstos:', error);
    throw new Error('Não foi possível carregar os reajustes previstos. Tente novamente mais tarde.');
  }
};

/**
 * Busca os parâmetros de reajuste
 * @returns {Promise<Object>} Parâmetros de reajuste
 */
export const fetchParametrosReajuste = async () => {
  try {
    const response = await api.get('/reajustes/parametros');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar parâmetros de reajuste:', error);
    
    // Se não houver parâmetros, retorna valores padrão
    return {
      indiceBase: 'IGPM',
      percentualAdicional: 6,
      intervaloParcelas: 12,
      alertaAntecipadoDias: 30
    };
  }
};

/**
 * Busca os índices econômicos
 * @returns {Promise<Object>} Índices econômicos
 */
export const fetchIndicesEconomicos = async () => {
  try {
    const response = await api.get('/reajustes/indices');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar índices econômicos:', error);
    
    // Retorna valores padrão para testes
    return {
      IGPM: 5.5,
      IPCA: 4.2,
      INPC: 3.8
    };
  }
};

/**
 * Aplica um reajuste a um contrato
 * @param {string} contratoId - ID do contrato
 * @returns {Promise<Object>} Reajuste aplicado
 */
export const aplicarReajuste = async (contratoId) => {
  try {
    const response = await api.post(`/reajustes/contratos/${contratoId}/aplicar`);
    return response.data;
  } catch (error) {
    console.error('Erro ao aplicar reajuste:', error);
    throw new Error('Não foi possível aplicar o reajuste. Tente novamente mais tarde.');
  }
};

/**
 * Simula um reajuste para um contrato
 * @param {string} contratoId - ID do contrato
 * @param {Object} parametrosOverride - Parâmetros para sobrescrever os padrões
 * @returns {Promise<Object>} Simulação do reajuste
 */
export const simularReajuste = async (contratoId, parametrosOverride = {}) => {
  try {
    const response = await api.post(`/reajustes/contratos/${contratoId}/simular`, parametrosOverride);
    return response.data;
  } catch (error) {
    console.error('Erro ao simular reajuste:', error);
    throw new Error('Não foi possível simular o reajuste. Tente novamente mais tarde.');
  }
};

/**
 * Salva os parâmetros de reajuste
 * @param {Object} parametros - Novos parâmetros
 * @returns {Promise<Object>} Parâmetros salvos
 */
export const salvarParametrosReajuste = async (parametros) => {
  try {
    const response = await api.put('/reajustes/parametros', parametros);
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar parâmetros de reajuste:', error);
    throw new Error('Não foi possível salvar os parâmetros. Tente novamente mais tarde.');
  }
};

/**
 * Busca o histórico de reajustes de um contrato
 * @param {string} contratoId - ID do contrato
 * @returns {Promise<Array>} Histórico de reajustes
 */
export const fetchHistoricoReajustes = async (contratoId) => {
  try {
    const response = await api.get(`/reajustes/contratos/${contratoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar histórico de reajustes:', error);
    throw new Error('Não foi possível carregar o histórico de reajustes. Tente novamente mais tarde.');
  }
};

/**
 * Gera um relatório de reajustes
 * @param {Object} filtros - Filtros para o relatório
 * @returns {Promise<Object>} Dados do relatório
 */
export const gerarRelatorioReajustes = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && value !== 'todos') {
        params.append(key, value);
      }
    });
    
    const response = await api.get(`/reajustes/relatorio?${params}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de reajustes:', error);
    throw new Error('Não foi possível gerar o relatório. Tente novamente mais tarde.');
  }
};