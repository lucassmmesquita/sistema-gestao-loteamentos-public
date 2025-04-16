// src/services/inadimplenciaService.js

import api from './api';

export const inadimplenciaService = {
  /**
   * Lista clientes inadimplentes com opção de filtros
   * @param {Object} filtros - Objeto contendo os filtros a serem aplicados
   * @returns {Promise} - Promise com os dados da requisição
   */
  listarClientesInadimplentes: async (filtros = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Adicionar filtros não vazios aos parâmetros
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await api.get(`/inadimplencia/clientes?${params}`);
      return response;
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
      const response = await api.get(`/inadimplencia/clientes/${clienteId}`);
      return response;
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
      const response = await api.get(`/inadimplencia/clientes/${clienteId}/interacoes`);
      return response;
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
      const response = await api.post(`/inadimplencia/clientes/${clienteId}/interacoes`, dados);
      return response;
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
      const response = await api.post(`/inadimplencia/clientes/${clienteId}/parcelas/${parcelaId}/boleto`);
      return response;
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
      const response = await api.put('/inadimplencia/configuracoes/gatilhos', { gatilhos });
      return response;
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
      const response = await api.get('/inadimplencia/configuracoes/gatilhos');
      return response;
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
      const params = new URLSearchParams();
      params.append('formato', formato);
      
      // Adicionar filtros não vazios aos parâmetros
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await api.get(`/inadimplencia/exportar?${params}`, { 
        responseType: 'blob' // Importante para receber o arquivo
      });
      
      return response;
    } catch (error) {
      console.error(`Erro ao exportar dados em formato ${formato}:`, error);
      throw error;
    }
  }
};

// Para uso com o serviço de comunicação
export const comunicacaoService = {
  /**
   * Envia uma comunicação para um cliente
   * @param {string} clienteId - ID do cliente
   * @param {string} tipo - Tipo de comunicação (email, sms, whatsapp)
   * @param {string} mensagem - Conteúdo da mensagem
   * @param {Array} anexos - Array de arquivos para anexar (opcional)
   * @returns {Promise} - Promise com os dados da requisição
   */
  enviarComunicacao: async (clienteId, tipo, mensagem, anexos = []) => {
    try {
      // Criar FormData para envio de arquivos
      const formData = new FormData();
      formData.append('clienteId', clienteId);
      formData.append('tipo', tipo);
      formData.append('mensagem', mensagem);
      
      // Adicionar anexos ao FormData
      anexos.forEach((anexo, index) => {
        formData.append(`anexo_${index}`, anexo);
      });
      
      const response = await api.post('/inadimplencia/comunicacao/enviar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error(`Erro ao enviar comunicação ${tipo} para cliente ${clienteId}:`, error);
      throw error;
    }
  },
  
  /**
   * Obtém histórico de comunicações com um cliente
   * @param {string} clienteId - ID do cliente
   * @returns {Promise} - Promise com os dados da requisição
   */
  obterHistoricoComunicacoes: async (clienteId) => {
    try {
      const response = await api.get(`/inadimplencia/clientes/${clienteId}/comunicacoes`);
      return response;
    } catch (error) {
      console.error(`Erro ao obter histórico de comunicações para cliente ${clienteId}:`, error);
      throw error;
    }
  },
  
  /**
   * Verifica o status de uma comunicação enviada
   * @param {string} comunicacaoId - ID da comunicação
   * @returns {Promise} - Promise com os dados da requisição
   */
  verificarStatusComunicacao: async (comunicacaoId) => {
    try {
      const response = await api.get(`/inadimplencia/comunicacao/${comunicacaoId}/status`);
      return response;
    } catch (error) {
      console.error(`Erro ao verificar status da comunicação ${comunicacaoId}:`, error);
      throw error;
    }
  },
  
  /**
   * Envia cobrança automática baseada em gatilhos
   * @param {string} clienteId - ID do cliente
   * @param {string} parcelaId - ID da parcela
   * @param {Object} gatilho - Configuração do gatilho a ser aplicado
   * @returns {Promise} - Promise com os dados da requisição
   */
  enviarCobrancaAutomatica: async (clienteId, parcelaId, gatilho) => {
    try {
      const response = await api.post('/inadimplencia/comunicacao/automatica', {
        clienteId,
        parcelaId,
        gatilho
      });
      return response;
    } catch (error) {
      console.error(`Erro ao enviar cobrança automática para cliente ${clienteId}, parcela ${parcelaId}:`, error);
      throw error;
    }
  },
  
  /**
   * Obtém modelos de mensagens predefinidos
   * @param {string} tipo - Tipo de comunicação (email, sms, whatsapp)
   * @returns {Promise} - Promise com os dados da requisição
   */
  obterModelosMensagens: async (tipo) => {
    try {
      const response = await api.get(`/inadimplencia/comunicacao/modelos?tipo=${tipo}`);
      return response;
    } catch (error) {
      console.error(`Erro ao obter modelos de mensagens para ${tipo}:`, error);
      throw error;
    }
  }
};