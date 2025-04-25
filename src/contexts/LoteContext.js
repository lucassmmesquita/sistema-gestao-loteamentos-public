// src/contexts/LoteContext.js

import React, { createContext, useState, useEffect, useCallback } from 'react';
import loteService from '../services/loteService';

export const LoteContext = createContext({});

export const LoteProvider = ({ children }) => {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentLote, setCurrentLote] = useState(null);

  // Carrega todos os lotes
  const loadLotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await loteService.getAll();
      setLotes(data);
    } catch (err) {
      setError('Erro ao carregar lotes: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar lotes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega um lote específico pelo ID
  const loadLote = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await loteService.getById(id);
      setCurrentLote(data);
      return data;
    } catch (err) {
      setError('Erro ao carregar lote: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar lote:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega lotes de uma quadra específica
  const loadLotesByQuadra = useCallback(async (quadra) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await loteService.getByQuadra(quadra);
      return data;
    } catch (err) {
      setError('Erro ao carregar lotes da quadra: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar lotes da quadra:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega todos os lotes disponíveis
  const loadLotesDisponiveis = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await loteService.getLotesDisponiveis();
      return data;
    } catch (err) {
      setError('Erro ao carregar lotes disponíveis: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar lotes disponíveis:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Salva um lote (novo ou existente)
  const saveLote = useCallback(async (lote) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('LoteContext.saveLote: Iniciando salvamento do lote', lote);
      let savedLote;
      
      if (lote.id) {
        console.log(`LoteContext.saveLote: Atualizando lote existente (ID: ${lote.id})`);
        // Atualiza lote existente
        savedLote = await loteService.update(lote.id, lote);
        
        // Atualiza a lista de lotes
        setLotes(prev => prev.map(l => l.id === lote.id ? savedLote : l));
      } else {
        console.log('LoteContext.saveLote: Criando novo lote');
        // Cria novo lote
        savedLote = await loteService.create(lote);
        
        // Adiciona à lista de lotes
        setLotes(prev => [...prev, savedLote]);
      }
      
      console.log('LoteContext.saveLote: Lote salvo com sucesso', savedLote);
      setCurrentLote(savedLote);
      return savedLote;
    } catch (err) {
      console.error('LoteContext.saveLote: Erro ao salvar lote', err);
      setError('Erro ao salvar lote: ' + (err.message || 'Erro desconhecido'));
      throw err; // Propaga o erro para ser tratado pelo componente
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove um lote
  const deleteLote = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await loteService.delete(id);
      
      // Remove da lista de lotes
      setLotes(prev => prev.filter(l => l.id !== id));
      
      // Limpa o lote atual se for o mesmo
      if (currentLote && currentLote.id === id) {
        setCurrentLote(null);
      }
      
      return true;
    } catch (err) {
      setError('Erro ao excluir lote: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao excluir lote:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentLote]);

  // Carrega a lista de lotes ao montar o componente
  useEffect(() => {
    loadLotes();
  }, [loadLotes]);

  const value = {
    lotes,
    loading,
    error,
    currentLote,
    loadLotes,
    loadLote,
    loadLotesByQuadra,
    loadLotesDisponiveis,
    saveLote,
    deleteLote,
    setCurrentLote
  };

  return (
    <LoteContext.Provider value={value}>
      {children}
    </LoteContext.Provider>
  );
};