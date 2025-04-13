import React, { createContext, useState, useEffect, useCallback } from 'react';
import boletoService from '../services/boletoService';
import cnabService from '../services/cnabService';
import importExportService from '../services/importExportService';

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
  const importarPagamentos = useCallback(async (arquivo) => {
    setLoading(true);
    setError(null);
    
    try {
      // Importa os dados do arquivo
      const dadosImportados = await importExportService.importarArquivo(arquivo);
      
      // Valida os dados importados
      const dadosValidados = dadosImportados.map(item => ({
        nossoNumero: item.nossoNumero,
        valorPago: parseFloat(item.valorPago) || 0,
        dataPagamento: item.dataPagamento || new Date().toISOString().split('T')[0],
        formaPagamento: item.formaPagamento || 'Importação',
        observacoes: item.observacoes || ''
      }));
      
      // Registra os pagamentos em lote
      const resultado = await boletoService.registrarPagamentosEmLote(dadosValidados);
      
      // Atualiza a lista de boletos com os pagamentos registrados
      if (resultado.sucesso.length > 0) {
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
  const processarArquivoRetorno = useCallback(async (arquivo) => {
    setLoading(true);
    setError(null);
    
    try {
      // Processa o arquivo de retorno
      const resultado = await cnabService.processarArquivoRetorno(arquivo);
      
      // Atualiza o status dos boletos no sistema
      const resultadoAtualizacao = await boletoService.atualizarStatusPorArquivoRetorno(
        resultado.registrosProcessados
      );
      
      // Atualiza a lista de boletos com os status atualizados
      if (resultadoAtualizacao.sucesso.length > 0) {
        const idsAtualizados = resultadoAtualizacao.sucesso.map(b => b.id);
        
        setBoletos(prev => prev.map(b => 
          idsAtualizados.includes(b.id) ? resultadoAtualizacao.sucesso.find(r => r.id === b.id) : b
        ));
        
        setFilteredBoletos(prev => prev.map(b => 
          idsAtualizados.includes(b.id) ? resultadoAtualizacao.sucesso.find(r => r.id === b.id) : b
        ));
      }
      
      return {
        ...resultado,
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

  // Gera arquivo de remessa
  const gerarArquivoRemessa = useCallback(async (boletoIds) => {
    setLoading(true);
    setError(null);
    
    try {
      // Filtra os boletos selecionados
      const boletosSelecionados = boletos.filter(b => boletoIds.includes(b.id));
      
      // Gera o arquivo de remessa
      const resultado = await cnabService.gerarArquivoRemessa(boletosSelecionados);
      
      return resultado;
    } catch (err) {
      setError('Erro ao gerar arquivo de remessa: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao gerar arquivo de remessa:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [boletos]);

  // Exporta boletos para Excel
  const exportarParaExcel = useCallback((boletosParaExportar = null, nomeArquivo = 'boletos', opcoes = {}) => {
    try {
      const dadosParaExportar = boletosParaExportar || filteredBoletos;
      
      // Prepara os dados para exportação
      const dadosFormatados = dadosParaExportar.map(boleto => ({
        Nosso_Numero: boleto.nossoNumero,
        Descricao: boleto.descricao,
        Cliente: boleto.clienteNome,
        Contrato: boleto.contratoId,
        Valor: boleto.valor,
        Data_Vencimento: boleto.dataVencimento,
        Status: boleto.status,
        Data_Pagamento: boleto.dataPagamento || '',
        Valor_Pago: boleto.valorPago || '',
      }));
      
      // Exporta para Excel
      return importExportService.exportarParaExcel(dadosFormatados, nomeArquivo, opcoes);
    } catch (err) {
      setError('Erro ao exportar para Excel: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao exportar para Excel:', err);
      return null;
    }
  }, [filteredBoletos]);

  // Exporta boletos para PDF
  const exportarParaPDF = useCallback((boletosParaExportar = null, nomeArquivo = 'boletos', opcoes = {}) => {
    try {
      const dadosParaExportar = boletosParaExportar || filteredBoletos;
      
      // Prepara os dados para exportação
      const dadosFormatados = dadosParaExportar.map(boleto => ({
        nossoNumero: boleto.nossoNumero,
        descricao: boleto.descricao,
        cliente: boleto.clienteNome,
        valor: boleto.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        dataVencimento: new Date(boleto.dataVencimento).toLocaleDateString('pt-BR'),
        status: boleto.status,
        dataPagamento: boleto.dataPagamento ? new Date(boleto.dataPagamento).toLocaleDateString('pt-BR') : '',
      }));
      
      // Define as colunas para o PDF
      const colunas = [
        { header: 'Nosso Número', dataKey: 'nossoNumero' },
        { header: 'Descrição', dataKey: 'descricao' },
        { header: 'Cliente', dataKey: 'cliente' },
        { header: 'Valor', dataKey: 'valor' },
        { header: 'Vencimento', dataKey: 'dataVencimento' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Pagamento', dataKey: 'dataPagamento' },
      ];
      
      // Exporta para PDF
      return importExportService.exportarParaPDF(dadosFormatados, nomeArquivo, {
        ...opcoes,
        titulo: 'Relatório de Boletos',
        colunas
      });
    } catch (err) {
      setError('Erro ao exportar para PDF: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao exportar para PDF:', err);
      return null;
    }
  }, [filteredBoletos]);

  // Gera modelo para importação de pagamentos
  const gerarModeloImportacao = useCallback(() => {
    try {
      return importExportService.gerarModeloImportacaoPagamentos();
    } catch (err) {
      setError('Erro ao gerar modelo de importação: ' + (err.message || 'Erro desconhecido'));
      console.error('Erro ao gerar modelo de importação:', err);
      return null;
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
    gerarArquivoRemessa,
    exportarParaExcel,
    exportarParaPDF,
    gerarModeloImportacao,
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