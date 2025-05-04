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
    // Simulação de login - na versão final, isso seria substituído por uma chamada real à API
    await new Promise(resolve => setTimeout(resolve, 800)); // Simula o tempo de rede
    
    // Defina os usuários permitidos
    const usuarios = {
      'admin@example.com': {
        password: 'admin123',
        user: {
          id: 1,
          name: 'Administrador',
          email: 'admin@example.com',
          role: 'admin',
          perfil: 'loteadora',
          permissions: [
            'users:manage', 'users:view', 'users:create', 'users:edit', 'users:delete',
            'clients:manage', 'clients:view', 'clients:create', 'clients:edit', 'clients:delete',
            'contracts:manage', 'contracts:view', 'contracts:create', 'contracts:edit', 'contracts:delete',
            'lots:manage', 'lots:view', 'lots:create', 'lots:edit', 'lots:delete',
            'invoices:manage', 'invoices:view', 'invoices:create', 'invoices:edit', 'invoices:delete',
            'reports:manage', 'reports:view', 'reports:create',
            'settings:manage', 'settings:view'
          ]
        }
      },
      'vendedor@example.com': {
        password: 'vendedor123',
        user: {
          id: 2,
          name: 'Vendedor Exemplo',
          email: 'vendedor@example.com',
          role: 'operator',
          perfil: 'vendedor',
          permissions: [
            'clients:view', 'clients:create', 'clients:edit',
            'contracts:view', 'contracts:create', 'contracts:edit',
            'lots:view'
          ]
        }
      },
      'proprietario@example.com': {
        password: 'proprietario123',
        user: {
          id: 3,
          name: 'Proprietário Exemplo',
          email: 'proprietario@example.com',
          role: 'operator',
          perfil: 'dono_terreno',
          permissions: [
            'contracts:view',
            'lots:view'
          ]
        }
      }
    };
    
    // Verifica se o usuário existe e se a senha está correta
    if (usuarios[email] && usuarios[email].password === password) {
      // Gera um token simulado com base no timestamp atual
      const token = `mock-jwt-token-${Date.now()}-${email}`;
      
      // Armazenar o token no localStorage para persistência entre sessões
      localStorage.setItem('auth_token', token);
      
      // Configurar o cabeçalho de autorização para requisições futuras
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return {
        user: usuarios[email].user,
        token
      };
    }
    
    // Se não for encontrado, lança um erro
    throw new Error('Credenciais inválidas');
  },

  /**
   * Valida token de autenticação
   * @param {string} token Token JWT
   * @returns {Promise} Promise com dados do usuário
   */
  validateToken: async (token) => {
    // Simulação de validação de token
    await new Promise(resolve => setTimeout(resolve, 300)); // Simula o tempo de rede
    
    // Extrai o email do token simulado
    const parts = token.split('-');
    if (parts.length >= 4) {
      const email = parts.slice(3).join('-');
      
      // Usuários simulados
      const usuarios = {
        'admin@example.com': {
          id: 1,
          name: 'Administrador',
          email: 'admin@example.com',
          role: 'admin',
          perfil: 'loteadora',
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
        'vendedor@example.com': {
          id: 2,
          name: 'Vendedor Exemplo',
          email: 'vendedor@example.com',
          role: 'operator',
          perfil: 'vendedor',
          permissions: [
            'clients:view', 'clients:create', 'clients:edit',
            'contracts:view', 'contracts:create', 'contracts:edit',
            'lots:view'
          ]
        },
        'proprietario@example.com': {
          id: 3,
          name: 'Proprietário Exemplo',
          email: 'proprietario@example.com',
          role: 'operator',
          perfil: 'dono_terreno',
          permissions: [
            'contracts:view',
            'lots:view'
          ]
        }
      };
      
      if (usuarios[email]) {
        return usuarios[email];
      }
    }
    
    throw new Error('Token inválido ou expirado');
  },

  /**
   * Realiza logout do usuário
   * @returns {void}
   */
  logout: () => {
    // Remover o token do localStorage
    localStorage.removeItem('auth_token');
    
    // Remover Authorization header das requisições futuras
    delete api.defaults.headers.common['Authorization'];
    
    return Promise.resolve();
  },

  /**
   * Configura o token para as requisições
   * @param {string} token Token JWT
   */
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('auth_token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('auth_token');
    }
  }
};

export default authService;