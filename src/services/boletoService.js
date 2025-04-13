import api from './api';
import caixaService from './caixaService';

/**
 * Serviço para gerenciar os boletos no sistema
 */
const boletoService = {
  /**
   * Busca todos os boletos
   * @param {Object} filtros - Filtros para a busca
   * @returns {Promise} Promise com a lista de boletos
   */
  getBoletos: async (filtros = {}) => {
    let query = '';
    
    if (filtros) {
      const params = new URLSearchParams();
      
      if (filtros.clienteId) params.append('clienteId', filtros.clienteId);
      if (filtros.contratoId) params.append('contratoId', filtros.contratoId);
      if (filtros.status) params.append('status', filtros.status);
      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
      
      query = params.toString();
    }
    
    const response = await api.get(`/boletos?${query}`);
    return response.data;
  },

  /**
   * Busca um boleto pelo ID
   * @param {number} id - ID do boleto
   * @returns {Promise} Promise com os dados do boleto
   */
  getBoletoById: async (id) => {
    const response = await api.get(`/boletos/${id}`);
    return response.data;
  },

  /**
   * Busca boletos por cliente
   * @param {number} clienteId - ID do cliente
   * @returns {Promise} Promise com a lista de boletos do cliente
   */
  getBoletosByCliente: async (clienteId) => {
    const response = await api.get(`/boletos?clienteId=${clienteId}`);
    return response.data;
  },

  /**
   * Busca boletos por contrato
   * @param {number} contratoId - ID do contrato
   * @returns {Promise} Promise com a lista de boletos do contrato
   */
  getBoletosByContrato: async (contratoId) => {
    const response = await api.get(`/boletos?contratoId=${contratoId}`);
    return response.data;
  },

  /**
   * Gera um novo boleto e o salva no sistema
   * @param {Object} dadosBoleto - Dados para geração do boleto
   * @returns {Promise} Promise com o boleto gerado
   */
  gerarBoleto: async (dadosBoleto) => {
    try {
      console.log("boletoService.gerarBoleto - Dados recebidos:", dadosBoleto);
      
      // Busca informações adicionais do cliente e contrato, se necessário
      let cliente;
      let contrato;
      
      if (dadosBoleto.clienteId) {
        try {
          const clienteResponse = await api.get(`/clientes/${dadosBoleto.clienteId}`);
          cliente = clienteResponse.data;
          console.log("Cliente encontrado:", cliente);
        } catch (err) {
          console.error("Erro ao buscar cliente:", err);
          // Não interrompemos o fluxo, apenas registramos o erro
        }
      }
      
      if (dadosBoleto.contratoId) {
        try {
          const contratoResponse = await api.get(`/contratos/${dadosBoleto.contratoId}`);
          contrato = contratoResponse.data;
          console.log("Contrato encontrado:", contrato);
        } catch (err) {
          console.error("Erro ao buscar contrato:", err);
          // Não interrompemos o fluxo, apenas registramos o erro
        }
      }
      
      // Monta os dados para a API da Caixa
      const dadosCaixa = {
        beneficiario: {
          codigo: caixaService.config.codigoBeneficiario,
          agencia: caixaService.config.agencia,
          conta: caixaService.config.conta,
          carteira: caixaService.config.carteira,
          cnpj: caixaService.config.cnpj,
        },
        pagador: {
          nome: cliente?.nome || dadosBoleto.nomePagador || dadosBoleto.clienteNome || 'Cliente',
          documento: cliente?.cpfCnpj || dadosBoleto.documentoPagador || '000.000.000-00',
          endereco: cliente?.endereco || dadosBoleto.enderecoPagador || {},
        },
        valor: dadosBoleto.valor || 0,
        dataVencimento: dadosBoleto.dataVencimento || new Date().toISOString().split('T')[0],
        numeroDocumento: dadosBoleto.numeroDocumento || `CONT${contrato?.id || dadosBoleto.contratoId || '000'}`,
        descricao: dadosBoleto.descricao || `Parcela ${dadosBoleto.numeroParcela || '1'} - Contrato ${contrato?.id || dadosBoleto.contratoId || '000'}`,
      };
      
      console.log("Dados enviados para a Caixa:", dadosCaixa);
      
      // Chama a API da Caixa para gerar o boleto
      const retornoCaixa = await caixaService.gerarBoleto(dadosCaixa);
      console.log("Retorno da Caixa:", retornoCaixa);
      
      // Salva o boleto no sistema
      const boletoDados = {
        clienteId: cliente?.id || dadosBoleto.clienteId,
        clienteNome: cliente?.nome || dadosBoleto.clienteNome || 'Cliente',
        contratoId: contrato?.id || dadosBoleto.contratoId,
        valor: dadosBoleto.valor,
        dataVencimento: dadosBoleto.dataVencimento,
        numeroParcela: dadosBoleto.numeroParcela || 1,
        descricao: dadosBoleto.descricao,
        nossoNumero: retornoCaixa.nossoNumero,
        linhaDigitavel: retornoCaixa.linhaDigitavel,
        codigoBarras: retornoCaixa.codigoBarras,
        pdfUrl: retornoCaixa.pdfUrl,
        dataGeracao: retornoCaixa.dataGeracao,
        status: retornoCaixa.status,
      };
      
      console.log("Dados do boleto a serem salvos:", boletoDados);
      
      const response = await api.post('/boletos', boletoDados);
      console.log("Resposta após salvar o boleto:", response.data);
      
      return response.data;
    } catch (error) {
      console.error('Erro detalhado ao gerar boleto:', error);
      console.error('Stack trace:', error.stack);
      throw new Error(`Falha ao gerar boleto: ${error.message}`);
    }
  },

  /**
   * Gera múltiplos boletos em lote
   * @param {Array} boletosData - Array com dados dos boletos a serem gerados
   * @returns {Promise} Promise com a lista de boletos gerados
   */
  gerarBoletosEmLote: async (boletosData) => {
    try {
      const boletosGerados = [];
      
      for (const boleto of boletosData) {
        const boletoGerado = await boletoService.gerarBoleto(boleto);
        boletosGerados.push(boletoGerado);
      }
      
      return boletosGerados;
    } catch (error) {
      console.error('Erro ao gerar boletos em lote:', error);
      throw new Error(`Falha ao gerar boletos em lote: ${error.message}`);
    }
  },

  /**
   * Cancela um boleto
   * @param {number} id - ID do boleto
   * @returns {Promise} Promise com o resultado da operação
   */
  cancelarBoleto: async (id) => {
    try {
      // Busca o boleto
      const boletoResponse = await api.get(`/boletos/${id}`);
      const boleto = boletoResponse.data;
      
      // Cancela o boleto na Caixa
      const retornoCaixa = await caixaService.cancelarBoleto(boleto.nossoNumero);
      
      // Atualiza o status no sistema
      const boletoAtualizado = {
        ...boleto,
        status: retornoCaixa.status,
        dataCancelamento: retornoCaixa.dataCancelamento,
      };
      
      const response = await api.put(`/boletos/${id}`, boletoAtualizado);
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar boleto:', error);
      throw new Error(`Falha ao cancelar boleto: ${error.message}`);
    }
  },

  /**
   * Registra o pagamento de um boleto
   * @param {number} id - ID do boleto
   * @param {Object} dadosPagamento - Dados do pagamento
   * @returns {Promise} Promise com o boleto atualizado
   */
  registrarPagamento: async (id, dadosPagamento) => {
    try {
      // Busca o boleto
      const boletoResponse = await api.get(`/boletos/${id}`);
      const boleto = boletoResponse.data;
      
      // Registra o pagamento
      const boletoAtualizado = {
        ...boleto,
        status: 'pago',
        dataPagamento: dadosPagamento.dataPagamento || new Date().toISOString(),
        valorPago: dadosPagamento.valorPago || boleto.valor,
        formaPagamento: dadosPagamento.formaPagamento || 'manual',
        comprovante: dadosPagamento.comprovante || null,
      };
      
      const response = await api.put(`/boletos/${id}`, boletoAtualizado);
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      throw new Error(`Falha ao registrar pagamento: ${error.message}`);
    }
  },

  /**
   * Registra pagamentos em lote (a partir de arquivo ou planilha)
   * @param {Array} pagamentos - Array com dados dos pagamentos
   * @returns {Promise} Promise com o resultado da operação
   */
  registrarPagamentosEmLote: async (pagamentos) => {
    try {
      const resultados = {
        sucesso: [],
        falha: []
      };
      
      for (const pagamento of pagamentos) {
        try {
          // Tenta encontrar o boleto pelo nossoNumero ou ID
          let boleto;
          
          if (pagamento.nossoNumero) {
            const response = await api.get(`/boletos?nossoNumero=${pagamento.nossoNumero}`);
            boleto = response.data[0];
          } else if (pagamento.boletoId) {
            const response = await api.get(`/boletos/${pagamento.boletoId}`);
            boleto = response.data;
          }
          
          if (!boleto) {
            resultados.falha.push({
              ...pagamento,
              erro: 'Boleto não encontrado'
            });
            continue;
          }
          
          // Verifica se o boleto já está pago
          if (boleto.status === 'pago') {
            resultados.falha.push({
              ...pagamento,
              erro: 'Boleto já está pago'
            });
            continue;
          }
          
          // Registra o pagamento
          const boletoAtualizado = await boletoService.registrarPagamento(boleto.id, {
            dataPagamento: pagamento.dataPagamento,
            valorPago: pagamento.valorPago,
            formaPagamento: pagamento.formaPagamento || 'importacao',
            comprovante: pagamento.comprovante
          });
          
          resultados.sucesso.push(boletoAtualizado);
        } catch (error) {
          resultados.falha.push({
            ...pagamento,
            erro: error.message
          });
        }
      }
      
      return resultados;
    } catch (error) {
      console.error('Erro ao registrar pagamentos em lote:', error);
      throw new Error(`Falha ao registrar pagamentos em lote: ${error.message}`);
    }
  },
  
  /**
   * Atualiza o status dos boletos a partir do arquivo de retorno
   * @param {Array} registros - Registros processados do arquivo de retorno
   * @returns {Promise} Promise com o resultado da operação
   */
  atualizarStatusPorArquivoRetorno: async (registros) => {
    try {
      const resultados = {
        sucesso: [],
        falha: []
      };
      
      for (const registro of registros) {
        try {
          // Busca o boleto pelo nossoNumero
          const response = await api.get(`/boletos?nossoNumero=${registro.nossoNumero}`);
          const boleto = response.data[0];
          
          if (!boleto) {
            resultados.falha.push({
              ...registro,
              erro: 'Boleto não encontrado'
            });
            continue;
          }
          
          // Atualiza o status do boleto
          const boletoAtualizado = {
            ...boleto,
            status: registro.status,
          };
          
          // Adiciona dados de pagamento se o status for 'pago'
          if (registro.status === 'pago') {
            boletoAtualizado.dataPagamento = registro.dataPagamento;
            boletoAtualizado.valorPago = registro.valorPago;
            boletoAtualizado.formaPagamento = 'arquivo_retorno';
          }
          
          const updateResponse = await api.put(`/boletos/${boleto.id}`, boletoAtualizado);
          resultados.sucesso.push(updateResponse.data);
        } catch (error) {
          resultados.falha.push({
            ...registro,
            erro: error.message
          });
        }
      }
      
      return resultados;
    } catch (error) {
      console.error('Erro ao atualizar status por arquivo de retorno:', error);
      throw new Error(`Falha ao atualizar status por arquivo de retorno: ${error.message}`);
    }
  }
};

export default boletoService;