import { useState, useEffect, useCallback } from 'react';
import { useInadimplenciaContext } from '../contexts/InadimplenciaContext';
import { inadimplenciaService } from '../services/inadimplenciaService';
import { comunicacaoService } from '../services/comunicacaoService';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Hook personalizado para gerenciar funcionalidades de inadimplência
 * @param {string} clienteId - ID opcional do cliente específico
 * @returns {Object} - Funções e estado para gestão de inadimplência
 */
export const useInadimplencia = (clienteId = null) => {
  const {
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
    carregarClientesInadimplentes
  } = useInadimplenciaContext();
  
  const [clienteAtual, setClienteAtual] = useState(null);
  const [historicoInteracoes, setHistoricoInteracoes] = useState([]);
  const [historicoComunicacoes, setHistoricoComunicacoes] = useState([]);
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);
  const [errorDetalhes, setErrorDetalhes] = useState(null);
  
  // Carregar detalhes do cliente se clienteId for fornecido
  useEffect(() => {
    if (clienteId) {
      carregarDetalhesCliente(clienteId);
    }
  }, [clienteId]);
  
  // Função para carregar detalhes do cliente
  const carregarDetalhesCliente = useCallback(async (id) => {
    if (!id) return;
    
    setLoadingDetalhes(true);
    setErrorDetalhes(null);
    
    try {
      // Carregar detalhes do cliente
      const clienteResponse = await inadimplenciaService.obterClienteInadimplente(id);
      setClienteAtual(clienteResponse.data);
      
      // Carregar histórico de interações
      const interacoesResponse = await inadimplenciaService.obterHistoricoInteracoes(id);
      setHistoricoInteracoes(interacoesResponse.data);
      
      // Carregar histórico de comunicações
      const comunicacoesResponse = await comunicacaoService.obterHistoricoComunicacoes(id);
      setHistoricoComunicacoes(comunicacoesResponse.data);
    } catch (err) {
      console.error('Erro ao carregar detalhes do cliente:', err);
      setErrorDetalhes('Erro ao carregar detalhes do cliente. Por favor, tente novamente.');
    } finally {
      setLoadingDetalhes(false);
    }
  }, []);
  
  // Função para exportar dados para Excel
  const exportarParaExcel = useCallback(async () => {
    try {
      const response = await inadimplenciaService.exportarDados('excel', filtros);
      
      // Criar um objeto URL para o blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Criar um link para download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inadimplentes_${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
      
      // Adicionar o link ao documento e clicar nele
      document.body.appendChild(link);
      link.click();
      
      // Limpar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      return { sucesso: true, mensagem: 'Arquivo Excel gerado com sucesso.' };
    } catch (err) {
      console.error('Erro ao exportar para Excel:', err);
      return { sucesso: false, mensagem: 'Erro ao gerar arquivo Excel.' };
    }
  }, [filtros]);
  
  // Função para exportar dados para PDF
  const exportarParaPDF = useCallback(async () => {
    try {
      const response = await inadimplenciaService.exportarDados('pdf', filtros);
      
      // Criar um objeto URL para o blob
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      
      // Criar um link para download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inadimplentes_${format(new Date(), 'dd-MM-yyyy')}.pdf`);
      
      // Adicionar o link ao documento e clicar nele
      document.body.appendChild(link);
      link.click();
      
      // Limpar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      return { sucesso: true, mensagem: 'Arquivo PDF gerado com sucesso.' };
    } catch (err) {
      console.error('Erro ao exportar para PDF:', err);
      return { sucesso: false, mensagem: 'Erro ao gerar arquivo PDF.' };
    }
  }, [filtros]);
  
  // Função para formatar valor monetário
  const formatarValor = useCallback((valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }, []);
  
  // Função para calcular dias de atraso
  const calcularDiasAtraso = useCallback((dataVencimento) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = Math.abs(hoje - vencimento);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);
  
  // Função para verificar se um gatilho deve ser acionado
  const verificarGatilhoAutomatico = useCallback((diasAtraso) => {
    return gatilhos.find(gatilho => gatilho.ativo && gatilho.dias === diasAtraso);
  }, [gatilhos]);
  
  // Função para executar gatilhos automáticos para todos os clientes
  const executarGatilhosAutomaticos = useCallback(async () => {
    try {
      setLoadingDetalhes(true);
      
      // Para cada cliente inadimplente
      for (const cliente of clientesInadimplentes) {
        // Para cada parcela em atraso
        for (const parcela of cliente.parcelas) {
          const diasAtraso = calcularDiasAtraso(parcela.dataVencimento);
          const gatilho = verificarGatilhoAutomatico(diasAtraso);
          
          // Se encontrar um gatilho para o número de dias de atraso
          if (gatilho) {
            await comunicacaoService.enviarCobrancaAutomatica(
              cliente.id,
              parcela.id,
              gatilho
            );
          }
        }
      }
      
      // Recarregar dados após execução dos gatilhos
      await carregarClientesInadimplentes();
      
      return { sucesso: true, mensagem: 'Gatilhos automáticos executados com sucesso.' };
    } catch (err) {
      console.error('Erro ao executar gatilhos automáticos:', err);
      return { sucesso: false, mensagem: 'Erro ao executar gatilhos automáticos.' };
    } finally {
      setLoadingDetalhes(false);
    }
  }, [clientesInadimplentes, calcularDiasAtraso, verificarGatilhoAutomatico, carregarClientesInadimplentes]);
  
  return {
    // Estados
    clientesInadimplentes,
    clienteAtual,
    historicoInteracoes,
    historicoComunicacoes,
    loading,
    loadingDetalhes,
    error,
    errorDetalhes,
    filtros,
    gatilhos,
    
    // Funções do contexto
    atualizarFiltros,
    limparFiltros,
    atualizarGatilhos,
    enviarComunicacaoManual,
    registrarInteracao,
    gerarNovoBoleto,
    carregarClientesInadimplentes,
    
    // Funções adicionais
    carregarDetalhesCliente,
    exportarParaExcel,
    exportarParaPDF,
    formatarValor,
    calcularDiasAtraso,
    verificarGatilhoAutomatico,
    executarGatilhosAutomaticos
  };
};