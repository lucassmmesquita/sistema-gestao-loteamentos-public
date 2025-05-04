// src/services/api.js

import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://100.24.3.60:3001/api/',
  baseURL: 'http://localhost:3001/api/',
  
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    console.log("API Interceptor: Token from localStorage:", token); // Log para depuração
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("API Interceptor: Authorization header set:", config.headers["Authorization"]); // Log para depuração
    } else {
      console.log("API Interceptor: No token found in localStorage."); // Log para depuração
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response) {
      // Erro com resposta do servidor
      console.error('API Error:', response.status, response.data);
      
      // Podemos retornar mensagens específicas baseado no status
      switch (response.status) {
        case 401:
          console.error('Não autorizado. Faça login novamente.');
          break;
        case 403:
          console.error('Acesso proibido.');
          break;
        case 404:
          console.error('Recurso não encontrado.');
          break;
        case 500:
          console.error('Erro interno do servidor.');
          break;
        default:
          console.error('Ocorreu um erro na requisição.');
      }
    } else {
      // Erro sem resposta (provavelmente de rede)
      console.error('Erro de rede. Verifique sua conexão.');
    }
    
    return Promise.reject(error);
  }
);

export default api;