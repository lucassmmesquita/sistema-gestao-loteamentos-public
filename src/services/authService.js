// src/services/authService.js

import api from './api';

const authService = {
  /**
   * Realiza login do usuário
   * @param {string} email Email do usuário
   * @param {string} password Senha do usuário
   * @returns {Promise} Promise com dados do usuário e token
   */
  login: async (email, password) => {
    // Simula um pequeno delay para parecer uma requisição real
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simula validação de credenciais
    if (email === 'admin@example.com' && password === 'admin123') {
      return {
        user: {
          id: 1,
          name: 'Administrador',
          email: 'admin@example.com',
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
        token: 'mock-jwt-token-' + Date.now()
      };
    }
    
    // Simula erro de autenticação
    throw new Error('Credenciais inválidas');
    
    // Versão original que se comunicava com a API
    // const response = await api.post('/auth/login', { email, password });
    // return response.data;
  },

  /**
   * Valida token de autenticação
   * @param {string} token Token JWT
   * @returns {Promise} Promise com dados do usuário
   */
  validateToken: async (token) => {
    // Simula validação de token
    return {
      id: 1,
      name: 'Administrador',
      email: 'admin@example.com',
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
    };
    
    // Versão original com API
    // try {
    //   const response = await api.get('/auth/profile', {
    //     headers: {
    //       'Authorization': `Bearer ${token}`
    //     }
    //   });
    //   return response.data;
    // } catch (error) {
    //   throw new Error('Token inválido ou expirado');
    // }
  },

  /**
   * Registra um novo usuário (para administradores)
   * @param {Object} userData Dados do usuário
   * @returns {Promise} Promise com os dados do usuário criado
   */
  register: async (userData) => {
    // Mock para registro de usuário
    await new Promise(resolve => setTimeout(resolve, 800));
    return { 
      ...userData, 
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    // Versão original com API
    // const response = await api.post('/auth/register', userData);
    // return response.data;
  },

  /**
   * Solicita recuperação de senha
   * @param {string} email Email do usuário
   * @returns {Promise} Promise com resultado da solicitação
   */
  forgotPassword: async (email) => {
    // Mock para recuperação de senha
    await new Promise(resolve => setTimeout(resolve, 800));
    return { message: 'E-mail de recuperação enviado com sucesso' };
    
    // Versão original com API
    // const response = await api.post('/auth/forgot-password', { email });
    // return response.data;
  },

  /**
   * Redefine a senha do usuário
   * @param {string} token Token de recuperação
   * @param {string} password Nova senha
   * @returns {Promise} Promise com resultado da operação
   */
  resetPassword: async (token, password) => {
    // Mock para redefinição de senha
    await new Promise(resolve => setTimeout(resolve, 800));
    return { message: 'Senha alterada com sucesso' };
    
    // Versão original com API
    // const response = await api.post('/auth/reset-password', { token, password });
    // return response.data;
  },

  /**
   * Atualiza dados de um usuário
   * @param {number} userId ID do usuário
   * @param {Object} userData Dados atualizados
   * @returns {Promise} Promise com os dados atualizados
   */
  updateUser: async (userId, userData) => {
    // Mock para atualização de usuário
    await new Promise(resolve => setTimeout(resolve, 800));
    return { 
      ...userData, 
      id: userId,
      updatedAt: new Date().toISOString()
    };
    
    // Versão original com API
    // const response = await api.put(`/auth/users/${userId}`, userData);
    // return response.data;
  },

  /**
   * Obtém a lista de usuários (para administradores)
   * @returns {Promise} Promise com a lista de usuários
   */
  getAllUsers: async () => {
    // Mock para lista de usuários
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      {
        id: 1,
        name: 'Administrador',
        email: 'admin@example.com',
        role: 'admin',
        status: true,
        createdAt: '2024-04-24T10:00:00.000Z'
      },
      {
        id: 2,
        name: 'Operador',
        email: 'operador@example.com',
        role: 'operator',
        status: true,
        createdAt: '2024-04-24T11:00:00.000Z'
      }
    ];
    
    // Versão original com API
    // const response = await api.get('/auth/users');
    // return response.data;
  },

  /**
   * Obtém dados de um usuário específico
   * @param {number} userId ID do usuário
   * @returns {Promise} Promise com os dados do usuário
   */
  getUserById: async (userId) => {
    // Mock para obter usuário pelo ID
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (userId === 1) {
      return {
        id: 1,
        name: 'Administrador',
        email: 'admin@example.com',
        role: 'admin',
        permissions: [
          'users:manage', 'users:view', 'users:create', 'users:edit', 'users:delete',
          'clients:manage', 'clients:view', 'clients:create', 'clients:edit', 'clients:delete',
          'contracts:manage', 'contracts:view', 'contracts:create', 'contracts:edit', 'contracts:delete',
          'lots:manage', 'lots:view', 'lots:create', 'lots:edit', 'lots:delete',
          'invoices:manage', 'invoices:view', 'invoices:create', 'invoices:edit', 'invoices:delete',
          'reports:manage', 'reports:view', 'reports:create',
          'settings:manage', 'settings:view'
        ],
        status: true,
        createdAt: '2024-04-24T10:00:00.000Z'
      };
    }
    
    throw new Error('Usuário não encontrado');
    
    // Versão original com API
    // const response = await api.get(`/auth/users/${userId}`);
    // return response.data;
  },

  /**
   * Remove um usuário
   * @param {number} userId ID do usuário a ser removido
   * @returns {Promise} Promise com o resultado da operação
   */
  deleteUser: async (userId) => {
    // Mock para exclusão de usuário
    await new Promise(resolve => setTimeout(resolve, 800));
    return { message: 'Usuário removido com sucesso' };
    
    // Versão original com API
    // const response = await api.delete(`/auth/users/${userId}`);
    // return response.data;
  }
};

export default authService;