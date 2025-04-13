import api from './api';

const clienteService = {
  /**
   * Busca todos os clientes
   * @returns {Promise} Promise com a lista de clientes
   */
  getAll: async () => {
    const response = await api.get('/clientes');
    return response.data;
  },

  /**
   * Busca um cliente pelo ID
   * @param {number} id - ID do cliente
   * @returns {Promise} Promise com os dados do cliente
   */
  getById: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  /**
   * Cria um novo cliente
   * @param {Object} cliente - Dados do cliente a ser criado
   * @returns {Promise} Promise com o cliente criado
   */
  create: async (cliente) => {
    // Adiciona a data de cadastro
    cliente.dataCadastro = new Date().toISOString();
    
    const response = await api.post('/clientes', cliente);
    return response.data;
  },

  /**
   * Atualiza um cliente existente
   * @param {number} id - ID do cliente
   * @param {Object} cliente - Dados atualizados do cliente
   * @returns {Promise} Promise com o cliente atualizado
   */
  update: async (id, cliente) => {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  },

  /**
   * Remove um cliente
   * @param {number} id - ID do cliente a ser removido
   * @returns {Promise} Promise com o resultado da operação
   */
  delete: async (id) => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  },

  /**
   * Realiza upload de documento para um cliente
   * @param {number} clienteId - ID do cliente
   * @param {Object} documento - Dados do documento
   * @returns {Promise} Promise com o resultado do upload
   */
  uploadDocumento: async (clienteId, documento) => {
    // Na implementação real, isso seria um upload de arquivo para um servidor
    // Aqui estamos apenas simulando o upload atualizando o cliente com o novo documento
    const cliente = await clienteService.getById(clienteId);
    
    if (!cliente.documentos) {
      cliente.documentos = [];
    }
    
    documento.dataUpload = new Date().toISOString();
    cliente.documentos.push(documento);
    
    const response = await api.put(`/clientes/${clienteId}`, cliente);
    return response.data;
  }
};

export default clienteService;