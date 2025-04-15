// src/contexts/DocumentosContratuaisContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const DocumentosContratuaisContext = createContext({});

export const DocumentosContratuaisProvider = ({ children }) => {
  const [aditivos, setAditivos] = useState([]);
  const [distratos, setDistratos] = useState([]);
  const [quitacoes, setQuitacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAditivo, setCurrentAditivo] = useState(null);
  const [currentDistrato, setCurrentDistrato] = useState(null);
  const [currentQuitacao, setCurrentQuitacao] = useState(null);

  // Carregar aditivos por contrato
  const loadAditivosByContrato = useCallback(async (contratoId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/aditivos?contratoId=${contratoId}`);
      return response.data;
    } catch (err) {
      setError('Erro ao carregar aditivos: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar aditivos:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar distratos por contrato
  const loadDistratosByContrato = useCallback(async (contratoId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/distratos?contratoId=${contratoId}`);
      return response.data;
    } catch (err) {
      setError('Erro ao carregar distratos: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar distratos:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar quitação por contrato
  const loadQuitacaoByContrato = useCallback(async (contratoId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/quitacoes?contratoId=${contratoId}`);
      if (response.data.length > 0) {
        return response.data[0]; // Retorna a primeira quitação encontrada
      }
      return null;
    } catch (err) {
      setError('Erro ao carregar quitação: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao carregar quitação:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar aditivo
  const saveAditivo = useCallback(async (aditivo) => {
    setLoading(true);
    setError(null);
    
    try {
      let savedAditivo;
      
      if (aditivo.id) {
        // Atualiza aditivo existente
        savedAditivo = await api.put(`/aditivos/${aditivo.id}`, aditivo);
      } else {
        // Cria novo aditivo
        savedAditivo = await api.post('/aditivos', aditivo);
      }
      
      return savedAditivo.data;
    } catch (err) {
      setError('Erro ao salvar aditivo: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao salvar aditivo:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar distrato
  const saveDistrato = useCallback(async (distrato) => {
    setLoading(true);
    setError(null);
    
    try {
      let savedDistrato;
      
      if (distrato.id) {
        // Atualiza distrato existente
        savedDistrato = await api.put(`/distratos/${distrato.id}`, distrato);
      } else {
        // Cria novo distrato
        savedDistrato = await api.post('/distratos', distrato);
      }
      
      return savedDistrato.data;
    } catch (err) {
      setError('Erro ao salvar distrato: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao salvar distrato:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar quitação
  const saveQuitacao = useCallback(async (quitacao) => {
    setLoading(true);
    setError(null);
    
    try {
      let savedQuitacao;
      
      if (quitacao.id) {
        // Atualiza quitação existente
        savedQuitacao = await api.put(`/quitacoes/${quitacao.id}`, quitacao);
      } else {
        // Cria nova quitação
        savedQuitacao = await api.post('/quitacoes', quitacao);
      }
      
      return savedQuitacao.data;
    } catch (err) {
      setError('Erro ao salvar quitação: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao salvar quitação:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Excluir aditivo
  const deleteAditivo = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/aditivos/${id}`);
      return true;
    } catch (err) {
      setError('Erro ao excluir aditivo: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao excluir aditivo:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Excluir distrato
  const deleteDistrato = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/distratos/${id}`);
      return true;
    } catch (err) {
      setError('Erro ao excluir distrato: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao excluir distrato:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Excluir quitação
  const deleteQuitacao = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/quitacoes/${id}`);
      return true;
    } catch (err) {
      setError('Erro ao excluir quitação: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao excluir quitação:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    aditivos,
    distratos,
    quitacoes,
    loading,
    error,
    currentAditivo,
    currentDistrato,
    currentQuitacao,
    loadAditivosByContrato,
    loadDistratosByContrato,
    loadQuitacaoByContrato,
    saveAditivo,
    saveDistrato,
    saveQuitacao,
    deleteAditivo,
    deleteDistrato,
    deleteQuitacao,
    setCurrentAditivo,
    setCurrentDistrato,
    setCurrentQuitacao
  };

  return (
    <DocumentosContratuaisContext.Provider value={value}>
      {children}
    </DocumentosContratuaisContext.Provider>
  );
};