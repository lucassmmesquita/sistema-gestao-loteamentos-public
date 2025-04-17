// src/services/authService.js

import api from './api';

const authService = {
  /**
   * Login de usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise} Promise com os dados do usuário e token
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Configura o token no cabeçalho padrão para futuras requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      return response.data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error('Credenciais inválidas');
    }
  },

  /**
   * Valida o token do usuário
   * @param {string} token - Token de autenticação
   * @returns {Promise} Promise com os dados do usuário
   */
  validateToken: async (token) => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      throw new Error('Token inválido ou expirado');
    }
  },

  /**
   * Registra um novo usuário
   * @param {Object} userData - Dados do usuário a ser registrado
   * @returns {Promise} Promise com os dados do usuário registrado
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw new Error(error.response?.data?.message || 'Erro ao registrar usuário');
    }
  },

  /**
   * Atualiza um usuário existente
   * @param {string} userId - ID do usuário
   * @param {Object} userData - Dados atualizados do usuário
   * @returns {Promise} Promise com os dados do usuário atualizado
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/auth/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error(error.response?.data?.message || 'Erro ao atualizar usuário');
    }
  },

  /**
   * Solicita recuperação de senha
   * @param {string} email - Email do usuário
   * @returns {Promise} Promise com o resultado da solicitação
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      throw new Error(error.response?.data?.message || 'Erro ao solicitar recuperação de senha');
    }
  },

  /**
   * Reseta a senha do usuário
   * @param {string} token - Token de recuperação de senha
   * @param {string} password - Nova senha
   * @returns {Promise} Promise com o resultado da operação
   */
  resetPassword: async (token, password) => {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      throw new Error(error.response?.data?.message || 'Erro ao resetar senha');
    }
  },

  /**
   * Lista todos os usuários (para administradores)
   * @returns {Promise} Promise com a lista de usuários
   */
  getUsers: async () => {
    try {
      const response = await api.get('/auth/users');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw new Error(error.response?.data?.message || 'Erro ao listar usuários');
    }
  },

  /**
   * Obtém um usuário pelo ID
   * @param {string} userId - ID do usuário
   * @returns {Promise} Promise com os dados do usuário
   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      throw new Error(error.response?.data?.message || 'Erro ao obter usuário');
    }
  },

  /**
   * Remove um usuário
   * @param {string} userId - ID do usuário a ser removido
   * @returns {Promise} Promise com o resultado da operação
   */
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      throw new Error(error.response?.data?.message || 'Erro ao remover usuário');
    }
  }
};

export default authService;