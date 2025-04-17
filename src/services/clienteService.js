import api from './api';

const clienteService = {
  /**
   * Busca todos os clientes
   * @returns {Promise} Promise com a lista de clientes
   */
  getAll: async () => {
    try {
      console.log('clienteService.getAll: Iniciando requisição');
      const response = await api.get('/clientes');
      console.log('clienteService.getAll: Requisição bem-sucedida', response.data);
      return response.data;
    } catch (error) {
      console.error('clienteService.getAll: Erro na requisição', error);
      console.error('clienteService.getAll: Status do erro', error.response?.status);
      console.error('clienteService.getAll: Detalhes do erro', error.response?.data);
      throw error;
    }
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
    try {
      console.log('clienteService.create: Iniciando requisição com dados:', cliente);
      // Adiciona a data de cadastro
      cliente.dataCadastro = new Date().toISOString();
      
      // Assegura que dataNascimento está em formato ISO se existir
      if (cliente.dataNascimento) {
        cliente.dataNascimento = new Date(cliente.dataNascimento).toISOString();
      }
      
      console.log('clienteService.create: URL da requisição', api.defaults.baseURL + '/clientes');
      const response = await api.post('/clientes', cliente);
      console.log('clienteService.create: Requisição bem-sucedida', response.data);
      return response.data;
    } catch (error) {
      console.error('clienteService.create: Erro na requisição', error);
      console.error('clienteService.create: Status do erro', error.response?.status);
      console.error('clienteService.create: Detalhes do erro', error.response?.data);
      throw error;
    }
  },

  /**
   * Atualiza um cliente existente
   * @param {number} id - ID do cliente
   * @param {Object} cliente - Dados atualizados do cliente
   * @returns {Promise} Promise com o cliente atualizado
   */
  update: async (id, cliente) => {
    // Cria uma cópia para não modificar o objeto original
    const clienteParaEnviar = { ...cliente };
    
    // Assegura que dataNascimento está em formato ISO se existir
    if (clienteParaEnviar.dataNascimento) {
      clienteParaEnviar.dataNascimento = new Date(clienteParaEnviar.dataNascimento).toISOString();
    }
    
    const response = await api.put(`/clientes/${id}`, clienteParaEnviar);
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