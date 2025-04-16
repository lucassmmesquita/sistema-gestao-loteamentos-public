// src/services/boletoService.js

import api from './api';

const boletoService = {
  /**
   * Busca todos os boletos
   * @param {Object} filtros - Filtros para a busca
   * @returns {Promise} Promise com a lista de boletos
   */
  getBoletos: async (filtros = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filtros.clienteId) params.append('clienteId', filtros.clienteId);
      if (filtros.contratoId) params.append('contratoId', filtros.contratoId);
      if (filtros.status) params.append('status', filtros.status);
      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
      if (filtros.busca) params.append('busca', filtros.busca);
      
      const response = await api.get(`/boletos?${params}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar boletos:', error);
      throw error;
    }
  },

  /**
   * Busca um boleto pelo ID
   * @param {number} id - ID do boleto
   * @returns {Promise} Promise com os dados do boleto
   */
  getBoletoById: async (id) => {
    try {
      const response = await api.get(`/boletos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar boleto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Gera um novo boleto
   * @param {Object} dadosBoleto - Dados para geração do boleto
   * @returns {Promise} Promise com o boleto gerado
   */
  gerarBoleto: async (dadosBoleto) => {
    try {
      const response = await api.post('/boletos', dadosBoleto);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar boleto:', error);
      throw error;
    }
  },

  /**
   * Gera múltiplos boletos em lote
   * @param {Array} boletosData - Array com dados dos boletos a serem gerados
   * @returns {Promise} Promise com a lista de boletos gerados
   */
  gerarBoletosEmLote: async (boletosData) => {
    try {
      const response = await api.post('/boletos/lote', boletosData);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar boletos em lote:', error);
      throw error;
    }
  },

  /**
   * Cancela um boleto
   * @param {number} id - ID do boleto
   * @returns {Promise} Promise com o resultado da operação
   */
  cancelarBoleto: async (id) => {
    try {
      const response = await api.patch(`/boletos/${id}/cancelar`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao cancelar boleto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Registra o pagamento de um boleto
   * @param {number} id - ID do boleto
   * @param {Object} dadosPagamento - Dados do pagamento
   * @returns {Promise} Promise com o boleto atualizado
   */
  registrarPagamento: async (id, dadosPagamento) => {
    try {
      const response = await api.patch(`/boletos/${id}/pagamento`, dadosPagamento);
      return response.data;
    } catch (error) {
      console.error(`Erro ao registrar pagamento do boleto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Registra pagamentos em lote
   * @param {Array} pagamentos - Array com dados dos pagamentos
   * @returns {Promise} Promise com o resultado da operação
   */
  registrarPagamentosEmLote: async (pagamentos) => {
    try {
      const response = await api.post('/boletos/pagamentos/lote', pagamentos);
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar pagamentos em lote:', error);
      throw error;
    }
  },
  
  /**
   * Atualiza o status dos boletos a partir do arquivo de retorno
   * @param {Array} registros - Registros processados do arquivo de retorno
   * @returns {Promise} Promise com o resultado da operação
   */
  atualizarStatusPorArquivoRetorno: async (registros) => {
    try {
      const response = await api.post('/boletos/arquivo-retorno', registros);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status por arquivo de retorno:', error);
      throw error;
    }
  }
};

export default boletoService;