import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const inadimplenciaService = {
  /**
   * Lista clientes inadimplentes com opção de filtros
   * @param {Object} filtros - Objeto contendo os filtros a serem aplicados
   * @returns {Promise} - Promise com os dados da requisição
   */
  listarClientesInadimplentes: async (filtros = {}) => {
    try {
      // Construir query params a partir dos filtros
      const params = new URLSearchParams();
      
      // Adicionar filtros não vazios aos parâmetros
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });
      
      return await axios.get(`${API_URL}/clientes-inadimplentes`, { params });
    } catch (error) {
      console.error('Erro ao listar clientes inadimplentes:', error);
      throw error;
    }
  },
  
  /**
   * Obtém detalhes de um cliente inadimplente específico
   * @param {string} clienteId - ID do cliente
   * @returns {Promise} - Promise com os dados da requisição
   */
  obterClienteInadimplente: async (clienteId) => {
    try {
      return await axios.get(`${API_URL}/clientes-inadimplentes/${clienteId}`);
    } catch (error) {
      console.error(`Erro ao obter cliente inadimplente ${clienteId}:`, error);
      throw error;
    }
  },
  
  /**
   * Obtém o histórico de interações com um cliente
   * @param {string} clienteId - ID do cliente
   * @returns {Promise} - Promise com os dados da requisição
   */
  obterHistoricoInteracoes: async (clienteId) => {
    try {
      return await axios.get(`${API_URL}/clientes/${clienteId}/interacoes`);
    } catch (error) {
      console.error(`Erro ao obter histórico de interações para cliente ${clienteId}:`, error);
      throw error;
    }
  },
  
  /**
   * Registra uma nova interação com um cliente
   * @param {string} clienteId - ID do cliente
   * @param {Object} dados - Dados da interação
   * @returns {Promise} - Promise com os dados da requisição
   */
  registrarInteracao: async (clienteId, dados) => {
    try {
      return await axios.post(`${API_URL}/clientes/${clienteId}/interacoes`, dados);
    } catch (error) {
      console.error(`Erro ao registrar interação para cliente ${clienteId}:`, error);
      throw error;
    }
  },
  
  /**
   * Gera um novo boleto para uma parcela em atraso
   * @param {string} clienteId - ID do cliente
   * @param {string} parcelaId - ID da parcela
   * @returns {Promise} - Promise com os dados da requisição
   */
  gerarNovoBoleto: async (clienteId, parcelaId) => {
    try {
      return await axios.post(`${API_URL}/clientes/${clienteId}/parcelas/${parcelaId}/boleto`);
    } catch (error) {
      console.error(`Erro ao gerar novo boleto para cliente ${clienteId}, parcela ${parcelaId}:`, error);
      throw error;
    }
  },
  
  /**
   * Salva configurações de gatilhos automáticos
   * @param {Array} gatilhos - Array com as configurações de gatilhos
   * @returns {Promise} - Promise com os dados da requisição
   */
  salvarGatilhos: async (gatilhos) => {
    try {
      return await axios.put(`${API_URL}/configuracoes/gatilhos`, { gatilhos });
    } catch (error) {
      console.error('Erro ao salvar configurações de gatilhos:', error);
      throw error;
    }
  },
  
  /**
   * Obtém configurações de gatilhos automáticos
   * @returns {Promise} - Promise com os dados da requisição
   */
  obterGatilhos: async () => {
    try {
      return await axios.get(`${API_URL}/configuracoes/gatilhos`);
    } catch (error) {
      console.error('Erro ao obter configurações de gatilhos:', error);
      throw error;
    }
  },
  
  /**
   * Exporta dados de clientes inadimplentes no formato especificado
   * @param {string} formato - Formato de exportação (excel, pdf)
   * @param {Object} filtros - Filtros aplicados aos dados
   * @returns {Promise} - Promise com os dados da requisição
   */
  exportarDados: async (formato, filtros = {}) => {
    try {
      // Construir query params a partir dos filtros
      const params = new URLSearchParams();
      params.append('formato', formato);
      
      // Adicionar filtros não vazios aos parâmetros
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });
      
      return await axios.get(`${API_URL}/clientes-inadimplentes/exportar`, { 
        params,
        responseType: 'blob' // Importante para receber o arquivo
      });
    } catch (error) {
      console.error(`Erro ao exportar dados em formato ${formato}:`, error);
      throw error;
    }
  }
};