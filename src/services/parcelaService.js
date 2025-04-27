// src/services/parcelaService.js

import api from './api';

const parcelaService = {
  /**
   * Busca todas as parcelas
   * @returns {Promise} Promise com a lista de parcelas
   */
  getAll: async () => {
    try {
      const response = await api.get('/parcelas');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar parcelas:', error);
      throw error;
    }
  },

  /**
   * Busca uma parcela pelo ID
   * @param {number} id - ID da parcela
   * @returns {Promise} Promise com os dados da parcela
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/parcelas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar parcela ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca parcelas de um contrato específico
   * @param {number} contratoId - ID do contrato
   * @returns {Promise} Promise com a lista de parcelas do contrato
   */
  getByContratoId: async (contratoId) => {
    try {
      const response = await api.get(`/parcelas/contrato/${contratoId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar parcelas do contrato ${contratoId}:`, error);
      throw error;
    }
  },

  /**
   * Gera parcelas para um contrato
   * @param {number} contratoId - ID do contrato
   * @returns {Promise} Promise com as parcelas geradas
   */
  gerarParcelas: async (contratoId) => {
    try {
      const response = await api.post(`/parcelas/gerar/${contratoId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao gerar parcelas para o contrato ${contratoId}:`, error);
      throw error;
    }
  },

  /**
   * Cria uma nova parcela
   * @param {Object} parcela - Dados da parcela a ser criada
   * @returns {Promise} Promise com a parcela criada
   */
  create: async (parcela) => {
    try {
      const response = await api.post('/parcelas', parcela);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar parcela:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma parcela existente
   * @param {number} id - ID da parcela
   * @param {Object} parcela - Dados atualizados da parcela
   * @returns {Promise} Promise com a parcela atualizada
   */
  update: async (id, parcela) => {
    try {
      const response = await api.put(`/parcelas/${id}`, parcela);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar parcela ${id}:`, error);
      throw error;
    }
  },

  /**
   * Remove uma parcela
   * @param {number} id - ID da parcela a ser removida
   * @returns {Promise} Promise com o resultado da operação
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/parcelas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir parcela ${id}:`, error);
      throw error;
    }
  },

  /**
   * Registra o pagamento de uma parcela
   * @param {number} id - ID da parcela
   * @param {Object} dadosPagamento - Dados do pagamento
   * @returns {Promise} Promise com a parcela atualizada
   */
  registrarPagamento: async (id, dadosPagamento) => {
    try {
      const response = await api.patch(`/parcelas/${id}/pagamento`, dadosPagamento);
      return response.data;
    } catch (error) {
      console.error(`Erro ao registrar pagamento da parcela ${id}:`, error);
      throw error;
    }
  }
};

export default parcelaService;