import axios from 'axios';
import { format } from 'date-fns';
import { calcularReajuste, calcularHistoricoReajustes } from '../utils/calculoReajuste';

// URL base da API (assumindo que estamos usando JSON Server para desenvolvimento)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Busca todos os reajustes com base nos filtros
 * @param {Object} filtros - Filtros para a busca
 * @returns {Promise<Array>} Lista de reajustes
 */
export const fetchReajustes = async (filtros = {}) => {
  try {
    let url = `${API_URL}/reajustes`;
    const params = {};
    
    // Aplica filtros
    if (filtros.cliente) params.clienteId = filtros.cliente;
    if (filtros.contrato) params.contratoId = filtros.contrato;
    if (filtros.status && filtros.status !== 'todos') params.status = filtros.status;
    
    // Filtros de data
    if (filtros.dataInicio && filtros.dataFim) {
      params.dataReferencia_gte = format(filtros.dataInicio, 'yyyy-MM-dd');
      params.dataReferencia_lte = format(filtros.dataFim, 'yyyy-MM-dd');
    }
    
    // Envia requisição com os parâmetros
    const response = await axios.get(url, { params });
    
    // Busca informações adicionais para enriquecer os dados
    const reajustes = response.data;
    
    // Para cada reajuste, buscar informações do contrato e cliente
    const reajustesEnriquecidos = await Promise.all(
      reajustes.map(async (reajuste) => {
        try {
          const contratoResponse = await axios.get(`${API_URL}/contratos/${reajuste.contratoId}`);
          const contrato = contratoResponse.data;
          
          let clienteInfo = { id: null, nome: 'Cliente não encontrado', documento: '' };
          
          if (contrato.clienteId) {
            try {
              const clienteResponse = await axios.get(`${API_URL}/clientes/${contrato.clienteId}`);
              const cliente = clienteResponse.data;
              clienteInfo = {
                id: cliente.id,
                nome: cliente.nome || 'Nome não disponível',
                documento: cliente.cpfCnpj || 'Documento não disponível'
              };
            } catch (clienteError) {
              console.error(`Erro ao buscar cliente ${contrato.clienteId}:`, clienteError);
            }
          }
          
          return {
            ...reajuste,
            contrato: {
              id: contrato.id,
              numero: contrato.numero || `#${contrato.id}`,
              dataInicio: contrato.dataInicio,
              valorParcela: contrato.valorParcela
            },
            cliente: clienteInfo
          };
        } catch (error) {
          console.error(`Erro ao buscar detalhes para o reajuste ${reajuste.id}:`, error);
          return {
            ...reajuste,
            contrato: {
              id: reajuste.contratoId,
              numero: `#${reajuste.contratoId}`,
              dataInicio: null,
              valorParcela: 0
            },
            cliente: {
              id: null,
              nome: 'Cliente não encontrado',
              documento: 'Documento não disponível'
            }
          };
        }
      })
    );
    
    return reajustesEnriquecidos;
  } catch (error) {
    console.error('Erro ao buscar reajustes:', error);
    throw new Error('Não foi possível carregar os reajustes. Tente novamente mais tarde.');
  }
};

/**
 * Busca os contratos com reajustes previstos para o período
 * @param {Date} dataInicio - Data de início do período
 * @param {Date} dataFim - Data de fim do período
 * @returns {Promise<Array>} Lista de contratos com reajustes previstos
 */
export const fetchReajustesPrevistos = async (dataInicio, dataFim) => {
  try {
    // Busca todos os contratos ativos
    const contratosResponse = await axios.get(`${API_URL}/contratos?status=ativo`);
    const contratos = contratosResponse.data;
    
    // Busca os parâmetros de reajuste
    const parametros = await fetchParametrosReajuste();
    
    // Filtra apenas os contratos com reajuste previsto no período
    const dataInicioObj = dataInicio || new Date();
    const dataFimObj = dataFim || new Date(dataInicioObj.getFullYear(), dataInicioObj.getMonth() + 1, 0);
    
    // Para cada contrato, calcula se há reajuste previsto no período
    const contratosComReajuste = await Promise.all(
      contratos.map(async (contrato) => {
        // Calcula o próximo reajuste
        const parcelasPagas = contrato.parcelasPagas || 0;
        const proximaParcelaReajuste = Math.ceil((parcelasPagas + 1) / parametros.intervaloParcelas) * parametros.intervaloParcelas;
        
        if (proximaParcelaReajuste > contrato.totalParcelas) {
          return null; // Não há mais reajustes previstos
        }
        
        // Busca informações do cliente
        let clienteInfo = { id: null, nome: 'Cliente não encontrado', documento: '' };
        
        if (contrato.clienteId) {
          try {
            const clienteResponse = await axios.get(`${API_URL}/clientes/${contrato.clienteId}`);
            const cliente = clienteResponse.data;
            clienteInfo = {
              id: cliente.id,
              nome: cliente.nome || 'Nome não disponível',
              documento: cliente.cpfCnpj || 'Documento não disponível'
            };
          } catch (error) {
            console.error(`Erro ao buscar cliente ${contrato.clienteId}:`, error);
          }
        }
        
        // Simula o reajuste para obter a data de referência
        const reajusteSimulado = calcularReajuste(
          contrato.valorParcela,
          contrato.dataInicio,
          proximaParcelaReajuste,
          parametros,
          await fetchIndicesEconomicos()
        );
        
        // Verifica se a data de referência está dentro do período
        const dataReferencia = new Date(reajusteSimulado.dataReferencia);
        const dentroDoIntervalo = dataReferencia >= dataInicioObj && dataReferencia <= dataFimObj;
        
        if (!dentroDoIntervalo) {
          return null;
        }
        
        return {
          id: `preview-${contrato.id}-${proximaParcelaReajuste}`,
          contratoId: contrato.id,
          parcelaReferencia: proximaParcelaReajuste,
          valorOriginal: contrato.valorParcela,
          valorReajustado: reajusteSimulado.valorReajustado,
          indiceAplicado: reajusteSimulado.indiceAplicado,
          percentualAdicional: reajusteSimulado.percentualAdicional,
          reajusteTotal: reajusteSimulado.reajusteTotal,
          dataReferencia: reajusteSimulado.dataReferencia,
          status: 'pendente',
          aplicado: false,
          contrato: {
            id: contrato.id,
            numero: contrato.numero || `#${contrato.id}`,
            dataInicio: contrato.dataInicio,
            valorParcela: contrato.valorParcela
          },
          cliente: clienteInfo
        };
      })
    );
    
    // Remove os nulls (contratos sem reajuste no período)
    return contratosComReajuste.filter(Boolean);
  } catch (error) {
    console.error('Erro ao buscar reajustes previstos:', error);
    throw new Error('Não foi possível carregar os reajustes previstos. Tente novamente mais tarde.');
  }
};

/**
 * Busca os parâmetros de reajuste
 * @returns {Promise<Object>} Parâmetros de reajuste
 */
export const fetchParametrosReajuste = async () => {
  try {
    const response = await axios.get(`${API_URL}/parametrosReajuste`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar parâmetros de reajuste:', error);
    
    // Se não houver parâmetros, retorna valores padrão
    return {
      indiceBase: 'IGPM',
      percentualAdicional: 6,
      intervaloParcelas: 12,
      alertaAntecipadoDias: 30
    };
  }
};

/**
 * Busca os índices econômicos
 * @returns {Promise<Object>} Índices econômicos
 */
export const fetchIndicesEconomicos = async () => {
  try {
    const response = await axios.get(`${API_URL}/indicesEconomicos`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar índices econômicos:', error);
    
    // Retorna valores padrão para testes
    return {
      IGPM: 5.5,
      IPCA: 4.2,
      INPC: 3.8
    };
  }
};

/**
 * Aplica um reajuste a um contrato
 * @param {string} contratoId - ID do contrato
 * @returns {Promise<Object>} Reajuste aplicado
 */
export const aplicarReajuste = async (contratoId) => {
  try {
    // Busca os dados do contrato
    const contratoResponse = await axios.get(`${API_URL}/contratos/${contratoId}`);
    const contrato = contratoResponse.data;
    
    // Busca os parâmetros de reajuste
    const parametros = await fetchParametrosReajuste();
    
    // Busca os índices econômicos
    const indicesEconomicos = await fetchIndicesEconomicos();
    
    // Calcula a próxima parcela que deve ser reajustada
    const parcelasPagas = contrato.parcelasPagas || 0;
    const proximaParcelaReajuste = Math.ceil((parcelasPagas + 1) / parametros.intervaloParcelas) * parametros.intervaloParcelas;
    
    // Calcula o reajuste
    const reajuste = calcularReajuste(
      contrato.valorParcela,
      contrato.dataInicio,
      proximaParcelaReajuste,
      parametros,
      indicesEconomicos
    );
    
    // Cria o registro de reajuste
    const novoReajuste = {
      contratoId,
      parcelaReferencia: proximaParcelaReajuste,
      valorOriginal: contrato.valorParcela,
      valorReajustado: reajuste.valorReajustado,
      indiceAplicado: reajuste.indiceAplicado,
      indiceBase: parametros.indiceBase,
      percentualAdicional: reajuste.percentualAdicional,
      reajusteTotal: reajuste.reajusteTotal,
      dataReferencia: reajuste.dataReferencia,
      dataAplicacao: format(new Date(), 'yyyy-MM-dd'),
      status: 'aplicado',
      aplicado: true
    };
    
    // Salva o registro de reajuste
    const reajusteResponse = await axios.post(`${API_URL}/reajustes`, novoReajuste);
    
    // Atualiza o valor da parcela no contrato
    const contratoAtualizado = {
      ...contrato,
      valorParcela: reajuste.valorReajustado,
      ultimoReajuste: {
        data: reajuste.dataReferencia,
        indice: reajuste.reajusteTotal,
        parcelaReferencia: proximaParcelaReajuste
      }
    };
    
    // Salva o contrato atualizado
    await axios.put(`${API_URL}/contratos/${contratoId}`, contratoAtualizado);
    
    return reajusteResponse.data;
  } catch (error) {
    console.error('Erro ao aplicar reajuste:', error);
    throw new Error('Não foi possível aplicar o reajuste. Tente novamente mais tarde.');
  }
};

/**
 * Simula um reajuste para um contrato
 * @param {string} contratoId - ID do contrato
 * @param {Object} parametrosOverride - Parâmetros para sobrescrever os padrões
 * @returns {Promise<Object>} Simulação do reajuste
 */
export const simularReajuste = async (contratoId, parametrosOverride = {}) => {
  try {
    // Busca os dados do contrato
    const contratoResponse = await axios.get(`${API_URL}/contratos/${contratoId}`);
    const contrato = contratoResponse.data;
    
    // Busca os parâmetros de reajuste
    const parametrosPadrao = await fetchParametrosReajuste();
    
    // Mescla os parâmetros padrão com os fornecidos
    const parametros = { ...parametrosPadrao, ...parametrosOverride };
    
    // Busca os índices econômicos
    const indicesEconomicos = await fetchIndicesEconomicos();
    
    // Calcula a próxima parcela que deve ser reajustada
    const parcelasPagas = contrato.parcelasPagas || 0;
    const proximaParcelaReajuste = Math.ceil((parcelasPagas + 1) / parametros.intervaloParcelas) * parametros.intervaloParcelas;
    
    // Calcula o reajuste
    const reajuste = calcularReajuste(
      contrato.valorParcela,
      contrato.dataInicio,
      proximaParcelaReajuste,
      parametros,
      indicesEconomicos
    );
    
    // Retorna a simulação
    return {
      contratoId,
      contrato: {
        numero: contrato.numero || `#${contrato.id}`,
        valorAtual: contrato.valorParcela
      },
      proximaParcelaReajuste,
      valorOriginal: contrato.valorParcela,
      valorReajustado: reajuste.valorReajustado,
      indiceAplicado: reajuste.indiceAplicado,
      indiceBase: parametros.indiceBase,
      percentualAdicional: parametros.percentualAdicional,
      reajusteTotal: reajuste.reajusteTotal,
      dataReferencia: reajuste.dataReferencia,
      simulado: true
    };
  } catch (error) {
    console.error('Erro ao simular reajuste:', error);
    throw new Error('Não foi possível simular o reajuste. Tente novamente mais tarde.');
  }
};

/**
 * Salva os parâmetros de reajuste
 * @param {Object} parametros - Novos parâmetros
 * @returns {Promise<Object>} Parâmetros salvos
 */
export const salvarParametrosReajuste = async (parametros) => {
  try {
    // Verifica se já existem parâmetros
    const response = await axios.get(`${API_URL}/parametrosReajuste`);
    
    if (response.data && response.data.id) {
      // Atualiza os parâmetros existentes
      const updateResponse = await axios.put(`${API_URL}/parametrosReajuste/${response.data.id}`, parametros);
      return updateResponse.data;
    } else {
      // Cria novos parâmetros
      const createResponse = await axios.post(`${API_URL}/parametrosReajuste`, parametros);
      return createResponse.data;
    }
  } catch (error) {
    console.error('Erro ao salvar parâmetros de reajuste:', error);
    throw new Error('Não foi possível salvar os parâmetros. Tente novamente mais tarde.');
  }
};

/**
 * Busca o histórico de reajustes de um contrato
 * @param {string} contratoId - ID do contrato
 * @returns {Promise<Array>} Histórico de reajustes
 */
export const fetchHistoricoReajustes = async (contratoId) => {
  try {
    const response = await axios.get(`${API_URL}/reajustes?contratoId=${contratoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar histórico de reajustes:', error);
    throw new Error('Não foi possível carregar o histórico de reajustes. Tente novamente mais tarde.');
  }
};

/**
 * Gera um relatório de reajustes
 * @param {Object} filtros - Filtros para o relatório
 * @returns {Promise<Object>} Dados do relatório
 */
export const gerarRelatorioReajustes = async (filtros = {}) => {
  try {
    // Busca os reajustes
    const reajustes = await fetchReajustes(filtros);
    
    // Agrupa os reajustes por contrato
    const reajustesPorContrato = reajustes.reduce((acc, reajuste) => {
      if (!acc[reajuste.contratoId]) {
        acc[reajuste.contratoId] = [];
      }
      
      acc[reajuste.contratoId].push(reajuste);
      return acc;
    }, {});
    
    // Para cada contrato, calcula as estatísticas
    const relatorio = Object.entries(reajustesPorContrato).map(([contratoId, reajustesContrato]) => {
      const contrato = reajustesContrato[0].contrato;
      const cliente = reajustesContrato[0].cliente;
      
      // Ordena os reajustes por data
      const reajustesOrdenados = [...reajustesContrato].sort(
        (a, b) => new Date(a.dataReferencia) - new Date(b.dataReferencia)
      );
      
      // Calcula o valor total do reajuste
      const valorTotalOriginal = reajustesOrdenados.reduce((sum, r) => sum + r.valorOriginal, 0);
      const valorTotalReajustado = reajustesOrdenados.reduce((sum, r) => sum + r.valorReajustado, 0);
      const diferencaTotal = valorTotalReajustado - valorTotalOriginal;
      
      return {
        contratoId,
        numeroContrato: contrato.numero || `#${contratoId}`,
        cliente: cliente.nome || 'Cliente não identificado',
        documentoCliente: cliente.documento || 'Documento não disponível',
        reajustes: reajustesOrdenados,
        valorTotalOriginal,
        valorTotalReajustado,
        diferencaTotal,
        percentualAcumulado: (diferencaTotal / valorTotalOriginal) * 100
      };
    });
    
    return {
      dataCriacao: format(new Date(), 'yyyy-MM-dd'),
      totalContratos: relatorio.length,
      filtrosAplicados: filtros,
      contratos: relatorio
    };
  } catch (error) {
    console.error('Erro ao gerar relatório de reajustes:', error);
    throw new Error('Não foi possível gerar o relatório. Tente novamente mais tarde.');
  }
};