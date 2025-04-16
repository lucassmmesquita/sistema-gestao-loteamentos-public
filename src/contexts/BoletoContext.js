// src/contexts/BoletoContext.js

import React, { createContext, useState, useEffect, useCallback } from 'react';
import boletoService from '../services/boletoService';

export const BoletoContext = createContext({});

export const BoletoProvider = ({ children }) => {
  const [boletos, setBoletos] = useState([]);
  const [filteredBoletos, setFilteredBoletos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentBoleto, setCurrentBoleto] = useState(null);
  const [filtros, setFiltros] = useState({
    clienteId: null,
    contratoId: null,
    status: null,
    dataInicio: null,
    dataFim: null,
    busca: ''
  });

  // Carrega todos os boletos
  const loadBoletos = useCallback(async (filtrosParam = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtrosAplicar = filtrosParam || filtros;
      const data = await boletoService.getBoletos(filtrosAplicar);
      setBoletos(data);
      
      // Aplica filtro de busca textual aqui
      if (filtrosAplicar.busca) {
        filtrarBoletos(data, filtrosAplicar.busca);
      } else {
        setFilteredBoletos(data);
      }
    } catch (err) {
      setError('Erro ao carregar boletos: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar boletos:', err);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  // Filtra boletos por texto
  const filtrarBoletos = (boletosData, busca) => {
    if (!busca) {
      setFilteredBoletos(boletosData);
      return;
    }
    
    const textoBusca = busca.toLowerCase();
    const resultado = boletosData.filter(boleto =>
      boleto.nossoNumero?.toLowerCase().includes(textoBusca) ||
      boleto.descricao?.toLowerCase().includes(textoBusca) ||
      boleto.linhaDigitavel?.toLowerCase().includes(textoBusca) ||
      boleto.clienteNome?.toLowerCase().includes(textoBusca)
    );
    
    setFilteredBoletos(resultado);
  };

  // Atualiza filtros
  const atualizarFiltros = useCallback((novosFiltros) => {
    setFiltros(prev => {
      const filtrosAtualizados = { ...prev, ...novosFiltros };
      
      // Se a busca for alterada, filtra os boletos já carregados
      if ('busca' in novosFiltros) {
        filtrarBoletos(boletos, novosFiltros.busca);
      }
      
      return filtrosAtualizados;
    });
    
    // Só recarrega os boletos se algum filtro além de 'busca' foi alterado
    const filtrosDeAPI = { ...novosFiltros };
    delete filtrosDeAPI.busca;
    
    if (Object.keys(filtrosDeAPI).length > 0) {
      loadBoletos({ ...filtros, ...novosFiltros });
    }
  }, [boletos, filtros, loadBoletos]);

  // Limpa todos os filtros
  const limparFiltros = useCallback(() => {
    setFiltros({
      clienteId: null,
      contratoId: null,
      status: null,
      dataInicio: null,
      dataFim: null,
      busca: ''
    });
    
    loadBoletos({});
  }, [loadBoletos]);

  // Carrega um boleto específico pelo ID
  const loadBoleto = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await boletoService.getBoletoById(id);
      setCurrentBoleto(data);
      return data;
    } catch (err) {
      setError('Erro ao carregar boleto: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar boleto:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Gera um novo boleto
  const gerarBoleto = useCallback(async (dadosBoleto) => {
    setLoading(true);
    setError(null);
    
    try {
      const boletoGerado = await boletoService.gerarBoleto(dadosBoleto);
      
      // Atualiza a lista de boletos
      setBoletos(prev => [...prev, boletoGerado]);
      setFilteredBoletos(prev => [...prev, boletoGerado]);
      
      return boletoGerado;
    } catch (err) {
      setError('Erro ao gerar boleto: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao gerar boleto:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Gera múltiplos boletos em lote
  const gerarBoletosEmLote = useCallback(async (boletosData) => {
    setLoading(true);
    setError(null);
    
    try {
      const boletosGerados = await boletoService.gerarBoletosEmLote(boletosData);
      
      // Atualiza a lista de boletos
      setBoletos(prev => [...prev, ...boletosGerados]);
      setFilteredBoletos(prev => [...prev, ...boletosGerados]);
      
      return boletosGerados;
    } catch (err) {
      setError('Erro ao gerar boletos em lote: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao gerar boletos em lote:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancela um boleto
  const cancelarBoleto = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const boletoCancelado = await boletoService.cancelarBoleto(id);
      
      // Atualiza o boleto na lista
      setBoletos(prev => prev.map(b => b.id === id ? boletoCancelado : b));
      setFilteredBoletos(prev => prev.map(b => b.id === id ? boletoCancelado : b));
      
      // Atualiza o boleto atual se for o mesmo
      if (currentBoleto && currentBoleto.id === id) {
        setCurrentBoleto(boletoCancelado);
      }
      
      return boletoCancelado;
    } catch (err) {
      setError('Erro ao cancelar boleto: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao cancelar boleto:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentBoleto]);

  // Registra o pagamento de um boleto
  const registrarPagamento = useCallback(async (id, dadosPagamento) => {
    setLoading(true);
    setError(null);
    
    try {
      const boletoPago = await boletoService.registrarPagamento(id, dadosPagamento);
      
      // Atualiza o boleto na lista
      setBoletos(prev => prev.map(b => b.id === id ? boletoPago : b));
      setFilteredBoletos(prev => prev.map(b => b.id === id ? boletoPago : b));
      
      // Atualiza o boleto atual se for o mesmo
      if (currentBoleto && currentBoleto.id === id) {
        setCurrentBoleto(boletoPago);
      }
      
      return boletoPago;
    } catch (err) {
      setError('Erro ao registrar pagamento: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao registrar pagamento:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentBoleto]);

  // Importa pagamentos de um arquivo
  const importarPagamentos = useCallback(async (pagamentos) => {
    setLoading(true);
    setError(null);
    
    try {
      // Registra os pagamentos em lote
      const resultado = await boletoService.registrarPagamentosEmLote(pagamentos);
      
      // Atualiza a lista de boletos com os pagamentos registrados
      if (resultado.sucesso && resultado.sucesso.length > 0) {
        const idsPagos = resultado.sucesso.map(b => b.id);
        
        setBoletos(prev => prev.map(b => 
          idsPagos.includes(b.id) ? resultado.sucesso.find(r => r.id === b.id) : b
        ));
        
        setFilteredBoletos(prev => prev.map(b => 
          idsPagos.includes(b.id) ? resultado.sucesso.find(r => r.id === b.id) : b
        ));
      }
      
      return resultado;
    } catch (err) {
      setError('Erro ao importar pagamentos: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao importar pagamentos:', err);
      return { sucesso: [], falha: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  // Processa um arquivo de retorno
  const processarArquivoRetorno = useCallback(async (registros) => {
    setLoading(true);
    setError(null);
    
    try {
      // Atualiza o status dos boletos no sistema
      const resultadoAtualizacao = await boletoService.atualizarStatusPorArquivoRetorno(registros);
      
      // Atualiza a lista de boletos com os status atualizados
      if (resultadoAtualizacao.sucesso && resultadoAtualizacao.sucesso.length > 0) {
        const idsAtualizados = resultadoAtualizacao.sucesso.map(b => b.id);
        
        setBoletos(prev => prev.map(b => 
          idsAtualizados.includes(b.id) ? resultadoAtualizacao.sucesso.find(r => r.id === b.id) : b
        ));
        
        setFilteredBoletos(prev => prev.map(b => 
          idsAtualizados.includes(b.id) ? resultadoAtualizacao.sucesso.find(r => r.id === b.id) : b
        ));
      }
      
      return {
        resultadoAtualizacao
      };
    } catch (err) {
      setError('Erro ao processar arquivo de retorno: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao processar arquivo de retorno:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega a lista de boletos ao montar o componente
  useEffect(() => {
    loadBoletos();
  }, [loadBoletos]);

  const value = {
    boletos,
    filteredBoletos,
    loading,
    error,
    currentBoleto,
    filtros,
    loadBoletos,
    loadBoleto,
    gerarBoleto,
    gerarBoletosEmLote,
    cancelarBoleto,
    registrarPagamento,
    importarPagamentos,
    processarArquivoRetorno,
    atualizarFiltros,
    limparFiltros,
    setCurrentBoleto
  };

  return (
    <BoletoContext.Provider value={value}>
      {children}
    </BoletoContext.Provider>
  );
};