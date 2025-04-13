import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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
      
      return await axios.post(`${API_URL}/comunicacao/enviar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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
      return await axios.get(`${API_URL}/clientes/${clienteId}/comunicacoes`);
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
      return await axios.get(`${API_URL}/comunicacao/${comunicacaoId}/status`);
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
      return await axios.post(`${API_URL}/comunicacao/automatica`, {
        clienteId,
        parcelaId,
        gatilho
      });
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
      return await axios.get(`${API_URL}/comunicacao/modelos`, {
        params: { tipo }
      });
    } catch (error) {
      console.error(`Erro ao obter modelos de mensagens para ${tipo}:`, error);
      throw error;
    }
  },
  
  /**
   * Salva um novo modelo de mensagem ou atualiza existente
   * @param {Object} modelo - Dados do modelo
   * @returns {Promise} - Promise com os dados da requisição
   */
  salvarModeloMensagem: async (modelo) => {
    try {
      if (modelo.id) {
        return await axios.put(`${API_URL}/comunicacao/modelos/${modelo.id}`, modelo);
      } else {
        return await axios.post(`${API_URL}/comunicacao/modelos`, modelo);
      }
    } catch (error) {
      console.error('Erro ao salvar modelo de mensagem:', error);
      throw error;
    }
  },
  
  /**
   * Executa teste de comunicação
   * @param {string} tipo - Tipo de comunicação
   * @param {string} destinatario - Email, telefone ou WhatsApp de teste
   * @param {string} mensagem - Mensagem de teste
   * @returns {Promise} - Promise com os dados da requisição
   */
  testarComunicacao: async (tipo, destinatario, mensagem) => {
    try {
      return await axios.post(`${API_URL}/comunicacao/teste`, {
        tipo,
        destinatario,
        mensagem
      });
    } catch (error) {
      console.error(`Erro ao testar comunicação ${tipo} para ${destinatario}:`, error);
      throw error;
    }
  }
};