// src/contexts/ContratoContext.js

import React, { createContext, useState, useCallback } from 'react';
import contratoService from '../services/contratoService';

export const ContratoContext = createContext();

export const ContratoProvider = ({ children }) => {
  const [contratos, setContratos] = useState([]);
  const [currentContrato, setCurrentContrato] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contratosFiltrados, setContratosFiltrados] = useState([]);

  const loadContratos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await contratoService.getAll();
      setContratos(data);
      return data;
    } catch (err) {
      setError('Erro ao carregar contratos: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar contratos:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadContrato = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await contratoService.getById(id);
      setCurrentContrato(data);
      return data;
    } catch (err) {
      setError('Erro ao carregar contrato: ' + (err.message || 'Erro desconhecido'));
      console.error(`Erro ao carregar contrato ${id}:`, err);
      setCurrentContrato(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadContratosByCliente = useCallback(async (clienteId) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await contratoService.getByClienteId(clienteId);
      return data;
    } catch (err) {
      setError('Erro ao carregar contratos do cliente: ' + (err.message || 'Erro desconhecido'));
      console.error(`Erro ao carregar contratos do cliente ${clienteId}:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createContrato = useCallback(async (contrato) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await contratoService.create(contrato);
      setContratos(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError('Erro ao criar contrato: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao criar contrato:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContrato = useCallback(async (id, contrato) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await contratoService.update(id, contrato);
      setContratos(prev => prev.map(c => c.id === id ? data : c));
      
      if (currentContrato && currentContrato.id === id) {
        setCurrentContrato(data);
      }
      
      return data;
    } catch (err) {
      setError('Erro ao atualizar contrato: ' + (err.message || 'Erro desconhecido'));
      console.error(`Erro ao atualizar contrato ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentContrato]);

  const deleteContrato = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await contratoService.delete(id);
      setContratos(prev => prev.filter(c => c.id !== id));
      
      if (currentContrato && currentContrato.id === id) {
        setCurrentContrato(null);
      }
      
      return true;
    } catch (err) {
      setError('Erro ao excluir contrato: ' + (err.message || 'Erro desconhecido'));
      console.error(`Erro ao excluir contrato ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentContrato]);

  const gerarPreviaContrato = useCallback(async (contrato) => {
    setLoading(true);
    setError(null);
    
    try {
      const previa = await contratoService.gerarPrevia(contrato);
      return previa;
    } catch (err) {
      setError('Erro ao gerar prévia do contrato: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao gerar prévia do contrato:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const aprovarContrato = useCallback(async (id, nivel, aprovado, observacao = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await contratoService.aprovarContrato(id, {
        nivel,
        aprovado,
        observacao
      });
      
      // Atualizar o contrato na lista
      setContratos(prev => prev.map(c => c.id === id ? result : c));
      
      // Atualizar o contrato atual se for o mesmo
      if (currentContrato && currentContrato.id === id) {
        setCurrentContrato(result);
      }
      
      return result;
    } catch (err) {
      setError('Erro ao aprovar contrato: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao aprovar contrato:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentContrato]);

  const oficializarContrato = useCallback(async (id, contratoOficialUrl, observacao = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await contratoService.oficializarContrato(id, {
        contratoOficialUrl,
        observacao
      });
      
      // Atualizar o contrato na lista
      setContratos(prev => prev.map(c => c.id === id ? result : c));
      
      // Atualizar o contrato atual se for o mesmo
      if (currentContrato && currentContrato.id === id) {
        setCurrentContrato(result);
      }
      
      return result;
    } catch (err) {
      setError('Erro ao oficializar contrato: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao oficializar contrato:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentContrato]);

  const loadContratosByVendedor = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await contratoService.getContratosByVendedor();
      setContratosFiltrados(data);
      return data;
    } catch (err) {
      setError('Erro ao carregar contratos do vendedor: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar contratos do vendedor:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadContratosByProprietario = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await contratoService.getContratosByProprietario();
      setContratosFiltrados(data);
      return data;
    } catch (err) {
      setError('Erro ao carregar contratos do proprietário: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar contratos do proprietário:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    contratos,
    currentContrato,
    loading,
    error,
    contratosFiltrados,
    loadContratos,
    loadContrato,
    loadContratosByCliente,
    createContrato,
    updateContrato,
    deleteContrato,
    gerarPreviaContrato,
    aprovarContrato,
    oficializarContrato,
    loadContratosByVendedor,
    loadContratosByProprietario
  };

  return (
    <ContratoContext.Provider value={value}>
      {children}
    </ContratoContext.Provider>
  );
};