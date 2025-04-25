// src/services/loteService.js

import api from './api';

const loteService = {
    /**
   * Importa lotes de uma planilha
   * @param {Array} lotes - Lista de lotes a serem importados
   * @returns {Promise} Promise com o resultado da importação
   */
  importarLotes: async (lotes) => {
    const response = await api.post('/lotes/import', lotes);
    return response.data;
  },
  /**
   * Busca todos os lotes
   * @returns {Promise} Promise com a lista de lotes
   */
  getAll: async () => {
    try {
      console.log('loteService.getAll: Iniciando requisição');
      const response = await api.get('/lotes');
      console.log('loteService.getAll: Requisição bem-sucedida', response.data);
      return response.data;
    } catch (error) {
      console.error('loteService.getAll: Erro na requisição', error);
      console.error('loteService.getAll: Status do erro', error.response?.status);
      console.error('loteService.getAll: Detalhes do erro', error.response?.data);
      throw error;
    }
  },

  /**
   * Busca um lote pelo ID
   * @param {number} id - ID do lote
   * @returns {Promise} Promise com os dados do lote
   */
  getById: async (id) => {
    const response = await api.get(`/lotes/${id}`);
    return response.data;
  },

  /**
   * Busca lotes por quadra
   * @param {string} quadra - Número da quadra
   * @returns {Promise} Promise com a lista de lotes da quadra
   */
  getByQuadra: async (quadra) => {
    const response = await api.get(`/lotes/quadra/${quadra}`);
    return response.data;
  },

  /**
   * Cria um novo lote
   * @param {Object} lote - Dados do lote a ser criado
   * @returns {Promise} Promise com o lote criado
   */
  create: async (lote) => {
    try {
      console.log('loteService.create: Iniciando requisição com dados:', lote);
      
      // Cria uma cópia para não modificar o objeto original
      const loteParaEnviar = { ...lote };
      
      // Define o status como disponível por padrão
      loteParaEnviar.status = loteParaEnviar.status || 'disponivel';
      
      console.log('loteService.create: Dados formatados para envio:', loteParaEnviar);
      const response = await api.post('/lotes', loteParaEnviar);
      console.log('loteService.create: Requisição bem-sucedida', response.data);
      return response.data;
    } catch (error) {
      console.error('loteService.create: Erro na requisição', error);
      console.error('loteService.create: Status do erro', error.response?.status);
      console.error('loteService.create: Detalhes do erro', error.response?.data);
      throw error;
    }
  },

  /**
   * Atualiza um lote existente
   * @param {number} id - ID do lote
   * @param {Object} lote - Dados atualizados do lote
   * @returns {Promise} Promise com o lote atualizado
   */
  update: async (id, lote) => {
    try {
      console.log('loteService.update: Iniciando atualização do lote', id, lote);
      
      // Cria uma cópia para não modificar o objeto original
      const loteParaEnviar = { ...lote };
      
      // Remove o campo id para evitar conflitos
      delete loteParaEnviar.id;
      
      console.log('loteService.update: Dados formatados para envio:', loteParaEnviar);
      const response = await api.put(`/lotes/${id}`, loteParaEnviar);
      console.log('loteService.update: Resposta do servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('loteService.update: Erro na requisição', error);
      console.error('loteService.update: Status do erro', error.response?.status);
      console.error('loteService.update: Detalhes do erro', error.response?.data);
      throw error;
    }
  },

  /**
   * Remove um lote
   * @param {number} id - ID do lote a ser removido
   * @returns {Promise} Promise com o resultado da operação
   */
  delete: async (id) => {
    const response = await api.delete(`/lotes/${id}`);
    return response.data;
  },

  /**
   * Busca todos os lotes disponíveis
   * @returns {Promise} Promise com a lista de lotes disponíveis
   */
  getLotesDisponiveis: async () => {
    const response = await api.get('/lotes?status=disponivel');
    return response.data;
  },

  /**
   * Importa lotes em massa
   * @param {Array} lotes - Lista de lotes a serem importados
   * @returns {Promise} Promise com o resultado da importação
   */
  importarLotes: async (lotes) => {
    const response = await api.post('/lotes/import', lotes);
    return response.data;
  }
};

export default loteService;
