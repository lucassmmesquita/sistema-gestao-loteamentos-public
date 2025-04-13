import React, { createContext, useState, useEffect, useCallback } from 'react';
import clienteService from '../services/clienteService';

export const ClienteContext = createContext({});

export const ClienteProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentCliente, setCurrentCliente] = useState(null);

  // Carrega todos os clientes
  const loadClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await clienteService.getAll();
      setClientes(data);
    } catch (err) {
      setError('Erro ao carregar clientes: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar clientes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega um cliente específico pelo ID
  const loadCliente = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await clienteService.getById(id);
      setCurrentCliente(data);
      return data;
    } catch (err) {
      setError('Erro ao carregar cliente: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar cliente:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Salva um cliente (novo ou existente)
  const saveCliente = useCallback(async (cliente) => {
    setLoading(true);
    setError(null);
    
    try {
      let savedCliente;
      
      if (cliente.id) {
        // Atualiza cliente existente
        savedCliente = await clienteService.update(cliente.id, cliente);
        
        // Atualiza a lista de clientes
        setClientes(prev => prev.map(c => c.id === cliente.id ? savedCliente : c));
      } else {
        // Cria novo cliente
        savedCliente = await clienteService.create(cliente);
        
        // Adiciona à lista de clientes
        setClientes(prev => [...prev, savedCliente]);
      }
      
      setCurrentCliente(savedCliente);
      return savedCliente;
    } catch (err) {
      setError('Erro ao salvar cliente: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao salvar cliente:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove um cliente
  const deleteCliente = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await clienteService.delete(id);
      
      // Remove da lista de clientes
      setClientes(prev => prev.filter(c => c.id !== id));
      
      // Limpa o cliente atual se for o mesmo
      if (currentCliente && currentCliente.id === id) {
        setCurrentCliente(null);
      }
      
      return true;
    } catch (err) {
      setError('Erro ao excluir cliente: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao excluir cliente:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentCliente]);

  // Upload de documento para cliente
  const uploadDocumento = useCallback(async (clienteId, documento) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCliente = await clienteService.uploadDocumento(clienteId, documento);
      
      // Atualiza o cliente na lista
      setClientes(prev => prev.map(c => c.id === clienteId ? updatedCliente : c));
      
      // Atualiza o cliente atual se for o mesmo
      if (currentCliente && currentCliente.id === clienteId) {
        setCurrentCliente(updatedCliente);
      }
      
      return updatedCliente;
    } catch (err) {
      setError('Erro ao fazer upload do documento: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao fazer upload do documento:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentCliente]);

  // Carrega a lista de clientes ao montar o componente
  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  const value = {
    clientes,
    loading,
    error,
    currentCliente,
    loadClientes,
    loadCliente,
    saveCliente,
    deleteCliente,
    uploadDocumento,
    setCurrentCliente
  };

  return (
    <ClienteContext.Provider value={value}>
      {children}
    </ClienteContext.Provider>
  );
};