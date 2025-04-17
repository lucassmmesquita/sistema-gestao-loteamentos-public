// src/services/authService.js (versão corrigida)

import api from './api';

// Usuários de teste para quando a API não estiver disponível
const MOCK_USERS = [
  {
    id: 1,
    name: 'Administrador',
    email: 'admin@exemplo.com',
    password: 'admin123',
    role: 'admin',
    permissions: [
      'users:manage', 'users:view', 'users:create', 'users:edit', 'users:delete',
      'clients:manage', 'clients:view', 'clients:create', 'clients:edit', 'clients:delete',
      'contracts:manage', 'contracts:view', 'contracts:create', 'contracts:edit', 'contracts:delete',
      'lots:manage', 'lots:view', 'lots:create', 'lots:edit', 'lots:delete',
      'invoices:manage', 'invoices:view', 'invoices:create', 'invoices:edit', 'invoices:delete',
      'reports:manage', 'reports:view', 'reports:create',
      'settings:manage', 'settings:view'
    ]
  },
  {
    id: 2,
    name: 'Operador',
    email: 'operador@exemplo.com',
    password: 'operador123',
    role: 'operator',
    permissions: [
      'clients:view',
      'contracts:view',
      'lots:view',
      'invoices:view', 'invoices:create',
      'reports:view'
    ]
  }
];

// Flag para determinar se deve usar autenticação mock ou real
const USE_MOCK_AUTH = false;

const authService = {
  /**
   * Login de usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise} Promise com os dados do usuário e token
   */
  login: async (email, password) => {
    try {
      console.log('Tentando login na API:', email);
      
      // Enviar credenciais para o backend
      const response = await api.post('/auth/login', { 
        email, 
        password // O servidor será responsável por comparar com o hash
      });
      
      console.log('Resposta do login:', response.status);
      
      // Configura o token no cabeçalho padrão para futuras requisições
      if (response.data && response.data.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro detalhado no login:', error);
      
      // Mensagens de erro mais específicas
      if (error.response) {
        console.error('Resposta de erro:', error.response.status, error.response.data);
        if (error.response.status === 401) {
          throw new Error('Credenciais inválidas. Verifique seu email e senha.');
        } else {
          throw new Error(`Erro ao fazer login: ${error.response.data?.message || 'Erro desconhecido'}`);
        }
      } else if (error.request) {
        console.error('Sem resposta do servidor');
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        console.error('Erro ao configurar requisição', error.message);
        throw new Error('Erro ao processar a requisição de login.');
      }
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
      if (USE_MOCK_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { ...userData, id: Date.now() };
      }
      
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
      if (USE_MOCK_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { ...userData, id: userId };
      }
      
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
      if (USE_MOCK_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { message: 'Email de recuperação enviado com sucesso' };
      }
      
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
      if (USE_MOCK_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { message: 'Senha alterada com sucesso' };
      }
      
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
      if (USE_MOCK_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return MOCK_USERS.map(user => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
      }
      
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
      if (USE_MOCK_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const user = MOCK_USERS.find(u => u.id === parseInt(userId));
        
        if (!user) {
          throw new Error('Usuário não encontrado');
        }
        
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      
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
      if (USE_MOCK_AUTH) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { message: 'Usuário removido com sucesso' };
      }
      
      const response = await api.delete(`/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      throw new Error(error.response?.data?.message || 'Erro ao remover usuário');
    }
  }
};

export default authService;