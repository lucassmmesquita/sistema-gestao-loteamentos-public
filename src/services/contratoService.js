// src/services/contratoService.js

import api from './api';

const contratoService = {
  /**
   * Importa contratos de uma planilha
   * @param {Array} contratos - Lista de contratos a serem importados
   * @returns {Promise} Promise com o resultado da importação
   */
  importarContratos: async (contratos) => {
    const response = await api.post('/contratos/import', contratos);
    return response.data;
  },
  
  /**
   * Busca todos os contratos
   * @returns {Promise} Promise com a lista de contratos
   */
  getAll: async () => {
    const response = await api.get('/contratos');
    return response.data;
  },

  /**
   * Busca um contrato pelo ID
   * @param {number} id - ID do contrato
   * @returns {Promise} Promise com os dados do contrato
   */
  getById: async (id) => {
    const response = await api.get(`/contratos/${id}`);
    return response.data;
  },

  /**
   * Busca contratos de um cliente específico
   * @param {number} clienteId - ID do cliente
   * @returns {Promise} Promise com a lista de contratos do cliente
   */
  getByClienteId: async (clienteId) => {
    const response = await api.get(`/contratos?clienteId=${clienteId}`);
    return response.data;
  },

  /**
   * Cria um novo contrato
   * @param {Object} contrato - Dados do contrato a ser criado
   * @returns {Promise} Promise com o contrato criado
   */
  create: async (contrato) => {
    // Adiciona a data de criação
    contrato.dataCriacao = new Date().toISOString();
    // Define o status como ativo por padrão
    contrato.status = contrato.status || 'ativo';
    
    const response = await api.post('/contratos', contrato);
    
    // Atualiza o status do lote para "vendido" ou "reservado" dependendo do caso
    if (response.data && response.data.loteId) {
      await api.patch(`/lotes/${response.data.loteId}`, {
        status: 'reservado'
      });
    }
    
    return response.data;
  },

  /**
   * Atualiza um contrato existente
   * @param {number} id - ID do contrato
   * @param {Object} contrato - Dados atualizados do contrato
   * @returns {Promise} Promise com o contrato atualizado
   */
  update: async (id, contrato) => {
    const response = await api.put(`/contratos/${id}`, contrato);
    return response.data;
  },

  /**
   * Remove um contrato
   * @param {number} id - ID do contrato a ser removido
   * @returns {Promise} Promise com o resultado da operação
   */
  delete: async (id) => {
    // Primeiro obtemos o contrato para saber qual lote liberar
    const contrato = await contratoService.getById(id);
    
    // Excluímos o contrato
    const response = await api.delete(`/contratos/${id}`);
    
    // Liberamos o lote se houver
    if (contrato && contrato.loteId) {
      await api.patch(`/lotes/${contrato.loteId}`, {
        status: 'disponivel'
      });
    }
    
    return response.data;
  },

  /**
   * Busca todos os lotes disponíveis
   * @returns {Promise} Promise com a lista de lotes disponíveis
   */
  getLotesDisponiveis: async () => {
    const response = await api.get('/lotes?status=disponivel');
    return response.data;
  },

  /**
   * Gera uma prévia do contrato em formato de texto
   * @param {Object} contrato - Dados do contrato
   * @returns {Promise} Promise com o texto do contrato
   */
  gerarPrevia: async (contrato) => {
    // Em uma implementação real, isso poderia chamar uma API de geração de documentos
    // Aqui estamos apenas simulando a geração do texto do contrato
    
    // Busca detalhes do cliente
    const clienteResponse = await api.get(`/clientes/${contrato.clienteId}`);
    const cliente = clienteResponse.data;
    
    // Busca detalhes do lote
    const loteResponse = await api.get(`/lotes/${contrato.loteId}`);
    const lote = loteResponse.data;
    
    // Gera o texto do contrato (simplificado)
    const textoContrato = `
CONTRATO DE COMPRA E VENDA DE IMÓVEL

VENDEDOR: Sistema de Gestão de Loteamentos LTDA
COMPRADOR: ${cliente.nome}, CPF/CNPJ: ${cliente.cpfCnpj}

OBJETO:
Lote n° ${lote.numero}, Quadra ${lote.quadra}, do Loteamento ${lote.loteamento},
com área de ${lote.area} m².

VALOR:
R$ ${contrato.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Entrada: R$ ${contrato.valorEntrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Saldo em ${contrato.numeroParcelas} parcelas mensais de R$ ${((contrato.valorTotal - contrato.valorEntrada) / contrato.numeroParcelas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

PRAZO:
Início: ${new Date(contrato.dataInicio).toLocaleDateString('pt-BR')}
Fim: ${new Date(contrato.dataFim).toLocaleDateString('pt-BR')}
Vencimento: Dia ${contrato.dataVencimento} de cada mês

CLÁUSULAS ESPECIAIS:
${contrato.clausulas}

[Local e data]

____________________
VENDEDOR

____________________
COMPRADOR
    `;
    
    return textoContrato;
  }
};

export default contratoService;