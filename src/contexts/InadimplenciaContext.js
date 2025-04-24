// src/contexts/InadimplenciaContext.js

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { inadimplenciaService, comunicacaoService } from '../services/inadimplenciaService';

// Criação do contexto
export const InadimplenciaContext = createContext();

// Hook personalizado para acessar o contexto
export const useInadimplenciaContext = () => useContext(InadimplenciaContext);

// Provider do contexto
export const InadimplenciaProvider = ({ children }) => {
  // Estado para clientes inadimplentes
  const [clientesInadimplentes, setClientesInadimplentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado para filtros
  const [filtros, setFiltros] = useState({
    statusPagamento: '',
    contratoId: '',
    valorMinimo: '',
    valorMaximo: '',
    diasAtrasoMin: '',
    diasAtrasoMax: '',
    dataUltimaCobrancaInicio: '',
    dataUltimaCobrancaFim: '',
    busca: ''
  });
  
  // Estado para configuração de gatilhos
  const [gatilhos, setGatilhos] = useState([
    { dias: 7, tipo: 'email', ativo: true, mensagem: 'Lembrete: Você possui uma parcela em atraso.' },
    { dias: 15, tipo: 'sms', ativo: true, mensagem: 'Sua parcela está em atraso há 15 dias. Entre em contato.' },
    { dias: 30, tipo: 'whatsapp', ativo: true, mensagem: 'Importante: Parcela em atraso há 30 dias. Acesse o link para regularizar.' },
  ]);
  
  // Função para carregar clientes inadimplentes
  const carregarClientesInadimplentes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando clientes inadimplentes com filtros:', filtros);
      const response = await inadimplenciaService.listarClientesInadimplentes(filtros);
      
      if (response && response.data) {
        console.log('Dados recebidos do backend:', response.data);
        setClientesInadimplentes(response.data);
      } else {
        console.warn('Resposta vazia ou inválida do backend');
        setClientesInadimplentes([]);
      }
    } catch (err) {
      console.error('Erro ao carregar clientes inadimplentes:', err);
      setError('Erro ao carregar clientes inadimplentes. Por favor, tente novamente.');
      setClientesInadimplentes([]);
    } finally {
      setLoading(false);
    }
  }, [filtros]);
  
  // Função para carregar gatilhos configurados
  const carregarGatilhos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await inadimplenciaService.obterGatilhos();
      if (response && response.data && response.data.gatilhos) {
        setGatilhos(response.data.gatilhos);
      }
    } catch (err) {
      console.error('Erro ao carregar gatilhos:', err);
      // Não mostramos erro para não interferir com a experiência do usuário
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Carregar clientes inadimplentes quando filtros mudarem
  useEffect(() => {
    carregarClientesInadimplentes();
  }, [carregarClientesInadimplentes]);
  
  // Carregar gatilhos ao iniciar
  useEffect(() => {
    carregarGatilhos();
  }, [carregarGatilhos]);
  
  // Função para atualizar filtros
  const atualizarFiltros = (novosFiltros) => {
    setFiltros(prevFiltros => ({ ...prevFiltros, ...novosFiltros }));
  };
  
  // Função para limpar filtros
  const limparFiltros = () => {
    setFiltros({
      statusPagamento: '',
      contratoId: '',
      valorMinimo: '',
      valorMaximo: '',
      diasAtrasoMin: '',
      diasAtrasoMax: '',
      dataUltimaCobrancaInicio: '',
      dataUltimaCobrancaFim: '',
      busca: ''
    });
  };
  
  // Função para atualizar gatilhos
  const atualizarGatilhos = async (novosGatilhos) => {
    setLoading(true);
    setError(null);
    
    try {
      await inadimplenciaService.salvarGatilhos(novosGatilhos);
      setGatilhos(novosGatilhos);
      return true;
    } catch (err) {
      console.error('Erro ao salvar gatilhos:', err);
      setError('Erro ao salvar gatilhos. Por favor, tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Função para enviar comunicação manual
  const enviarComunicacaoManual = async (clienteId, tipo, mensagem, anexos) => {
    try {
      setLoading(true);
      await comunicacaoService.enviarComunicacao(clienteId, tipo, mensagem, anexos);
      // Recarregar histórico após envio bem-sucedido
      await carregarClientesInadimplentes();
      return { sucesso: true, mensagem: `Comunicação via ${tipo} enviada com sucesso.` };
    } catch (err) {
      console.error('Erro ao enviar comunicação:', err);
      return { sucesso: false, mensagem: `Erro ao enviar comunicação via ${tipo}.` };
    } finally {
      setLoading(false);
    }
  };
  
  // Função para registrar interação manual
  const registrarInteracao = async (clienteId, dados) => {
    try {
      setLoading(true);
      await inadimplenciaService.registrarInteracao(clienteId, dados);
      // Recarregar dados após registro
      await carregarClientesInadimplentes();
      return { sucesso: true, mensagem: 'Interação registrada com sucesso.' };
    } catch (err) {
      console.error('Erro ao registrar interação:', err);
      return { sucesso: false, mensagem: 'Erro ao registrar interação.' };
    } finally {
      setLoading(false);
    }
  };
  
  // Função para gerar novo boleto
  const gerarNovoBoleto = async (clienteId, parcelaId) => {
    try {
      setLoading(true);
      const response = await inadimplenciaService.gerarNovoBoleto(clienteId, parcelaId);
      // Recarregar dados após gerar boleto
      await carregarClientesInadimplentes();
      return { 
        sucesso: true, 
        mensagem: 'Novo boleto gerado com sucesso.', 
        boleto: response.data 
      };
    } catch (err) {
      console.error('Erro ao gerar novo boleto:', err);
      return { sucesso: false, mensagem: 'Erro ao gerar novo boleto.' };
    } finally {
      setLoading(false);
    }
  };
  
  // Funções utilitárias
  const formatarValor = (valor) => {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };
  
  const calcularDiasAtraso = (dataVencimento) => {
    if (!dataVencimento) return 0;
    
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    
    // Verifica se a data é válida
    if (isNaN(vencimento.getTime())) return 0;
    
    const diffTime = Math.abs(hoje - vencimento);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Valor do contexto
  const value = {
    clientesInadimplentes,
    loading,
    error,
    filtros,
    gatilhos,
    atualizarFiltros,
    limparFiltros,
    atualizarGatilhos,
    enviarComunicacaoManual,
    registrarInteracao,
    gerarNovoBoleto,
    carregarClientesInadimplentes,
    formatarValor,
    calcularDiasAtraso
  };
  
  return (
    <InadimplenciaContext.Provider value={value}>
      {children}
    </InadimplenciaContext.Provider>
  );
};