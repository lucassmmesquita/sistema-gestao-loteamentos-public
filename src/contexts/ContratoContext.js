import React, { createContext, useState, useEffect, useCallback } from 'react';
import contratoService from '../services/contratoService';

export const ContratoContext = createContext({});

export const ContratoProvider = ({ children }) => {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentContrato, setCurrentContrato] = useState(null);
  const [lotes, setLotes] = useState([]);

  // Carrega todos os contratos
  const loadContratos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await contratoService.getAll();
      setContratos(data);
    } catch (err) {
      setError('Erro ao carregar contratos: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar contratos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega um contrato específico pelo ID
  const loadContrato = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await contratoService.getById(id);
      setCurrentContrato(data);
      return data;
    } catch (err) {
      setError('Erro ao carregar contrato: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar contrato:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega contratos de um cliente específico
  const loadContratosByCliente = useCallback(async (clienteId) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await contratoService.getByClienteId(clienteId);
      return data;
    } catch (err) {
      setError('Erro ao carregar contratos do cliente: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar contratos do cliente:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega lotes disponíveis
  const loadLotesDisponiveis = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await contratoService.getLotesDisponiveis();
      setLotes(data);
      return data;
    } catch (err) {
      setError('Erro ao carregar lotes disponíveis: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar lotes disponíveis:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Salva um contrato (novo ou existente)
  const saveContrato = useCallback(async (contrato) => {
    setLoading(true);
    setError(null);
    
    try {
      let savedContrato;
      
      if (contrato.id) {
        // Atualiza contrato existente
        savedContrato = await contratoService.update(contrato.id, contrato);
        
        // Atualiza a lista de contratos
        setContratos(prev => prev.map(c => c.id === contrato.id ? savedContrato : c));
      } else {
        // Cria novo contrato
        savedContrato = await contratoService.create(contrato);
        
        // Adiciona à lista de contratos
        setContratos(prev => [...prev, savedContrato]);
      }
      
      setCurrentContrato(savedContrato);
      
      // Recarrega os lotes disponíveis, pois um lote pode ter mudado de status
      loadLotesDisponiveis();
      
      return savedContrato;
    } catch (err) {
      setError('Erro ao salvar contrato: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao salvar contrato:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadLotesDisponiveis]);

  // Remove um contrato
  const deleteContrato = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await contratoService.delete(id);
      
      // Remove da lista de contratos
      setContratos(prev => prev.filter(c => c.id !== id));
      
      // Limpa o contrato atual se for o mesmo
      if (currentContrato && currentContrato.id === id) {
        setCurrentContrato(null);
      }
      
      // Recarrega os lotes disponíveis, pois um lote foi liberado
      loadLotesDisponiveis();
      
      return true;
    } catch (err) {
      setError('Erro ao excluir contrato: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao excluir contrato:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentContrato, loadLotesDisponiveis]);
  
  const loadContratosByLote = useCallback(async (loteId) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await contratoService.getByLoteId(loteId);
      return data;
    } catch (err) {
      setError('Erro ao carregar contratos do lote: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar contratos do lote:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Gera uma prévia do contrato
  const gerarPreviaContrato = useCallback(async (contrato) => {
    setLoading(true);
    setError(null);
    
    try {
      const textoContrato = await contratoService.gerarPrevia(contrato);
      return textoContrato;
    } catch (err) {
      setError('Erro ao gerar prévia do contrato: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao gerar prévia do contrato:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega a lista de contratos e lotes ao montar o componente
  useEffect(() => {
    loadContratos();
    loadLotesDisponiveis();
  }, [loadContratos, loadLotesDisponiveis]);

  const value = {
    contratos,
    lotes,
    loading,
    error,
    currentContrato,
    loadContratos,
    loadContrato,
    loadContratosByCliente,
    loadLotesDisponiveis,
    loadContratosByLote,
    saveContrato,
    deleteContrato,
    gerarPreviaContrato,
    setCurrentContrato
  };

  return (
    <ContratoContext.Provider value={value}>
      {children}
    </ContratoContext.Provider>
  );
};