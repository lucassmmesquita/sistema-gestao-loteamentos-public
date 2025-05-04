// src/services/dashboardService.js
import api from './api';

const dashboardService = {
  getDashboardData: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar dados do dashboard');
    }
  },
};

export default dashboardService;

