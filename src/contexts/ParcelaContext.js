// src/contexts/ParcelaContext.js

import React, { createContext, useState, useEffect, useCallback } from 'react';
import parcelaService from '../services/parcelaService';

export const ParcelaContext = createContext({});

export const ParcelaProvider = ({ children }) => {
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentParcela, setCurrentParcela] = useState(null);

  // Carrega todas as parcelas
  const loadParcelas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await parcelaService.getAll();
      setParcelas(data);
    } catch (err) {
      setError('Erro ao carregar parcelas: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar parcelas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega uma parcela específica pelo ID
  const loadParcela = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await parcelaService.getById(id);
      setCurrentParcela(data);
      return data;
    } catch (err) {
      setError('Erro ao carregar parcela: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar parcela:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega parcelas de um contrato específico
  const loadParcelasByContrato = useCallback(async (contratoId) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await parcelaService.getByContratoId(contratoId);
      return data;
    } catch (err) {
      setError('Erro ao carregar parcelas do contrato: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar parcelas do contrato:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Gera parcelas para um contrato
  const gerarParcelasDeContrato = useCallback(async (contratoId) => {
    setLoading(true);
    setError(null);
    
    try {
      const parcelasGeradas = await parcelaService.gerarParcelas(contratoId);
      return parcelasGeradas;
    } catch (err) {
      setError('Erro ao gerar parcelas para o contrato: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao gerar parcelas para o contrato:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Salva uma parcela (nova ou existente)
  const saveParcela = useCallback(async (parcela) => {
    setLoading(true);
    setError(null);
    
    try {
      let savedParcela;
      
      if (parcela.id) {
        // Atualiza parcela existente
        savedParcela = await parcelaService.update(parcela.id, parcela);
        
        // Atualiza a lista de parcelas
        setParcelas(prev => prev.map(p => p.id === parcela.id ? savedParcela : p));
      } else {
        // Cria nova parcela
        savedParcela = await parcelaService.create(parcela);
        
        // Adiciona à lista de parcelas
        setParcelas(prev => [...prev, savedParcela]);
      }
      
      setCurrentParcela(savedParcela);
      return savedParcela;
    } catch (err) {
      setError('Erro ao salvar parcela: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao salvar parcela:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Registrar pagamento de parcela
  const registrarPagamento = useCallback(async (id, dadosPagamento) => {
    setLoading(true);
    setError(null);
    
    try {
      const parcelaPaga = await parcelaService.registrarPagamento(id, dadosPagamento);
      
      // Atualiza a parcela na lista
      setParcelas(prev => prev.map(p => p.id === id ? parcelaPaga : p));
      
      // Atualiza a parcela atual se for a mesma
      if (currentParcela && currentParcela.id === id) {
        setCurrentParcela(parcelaPaga);
      }
      
      return parcelaPaga;
    } catch (err) {
      setError('Erro ao registrar pagamento: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao registrar pagamento:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentParcela]);

  // Remove uma parcela
  const deleteParcela = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await parcelaService.delete(id);
      
      // Remove da lista de parcelas
      setParcelas(prev => prev.filter(p => p.id !== id));
      
      // Limpa a parcela atual se for a mesma
      if (currentParcela && currentParcela.id === id) {
        setCurrentParcela(null);
      }
      
      return true;
    } catch (err) {
      setError('Erro ao excluir parcela: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao excluir parcela:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentParcela]);

  // Carrega a lista de parcelas ao montar o componente
  useEffect(() => {
    loadParcelas();
  }, [loadParcelas]);

  const value = {
    parcelas,
    loading,
    error,
    currentParcela,
    loadParcelas,
    loadParcela,
    loadParcelasByContrato,
    gerarParcelasDeContrato,
    saveParcela,
    registrarPagamento,
    deleteParcela,
    setCurrentParcela
  };

  return (
    <ParcelaContext.Provider value={value}>
      {children}
    </ParcelaContext.Provider>
  );
};