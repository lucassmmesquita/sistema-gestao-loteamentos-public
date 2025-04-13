import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Formata a data para exibição
 * @param {string|Date} data - Data a ser formatada
 * @param {string} formatStr - Formato da data
 * @returns {string} Data formatada
 */
const formatarData = (data, formatStr = 'dd/MM/yyyy') => {
  if (!data) return '';
  const dataObj = typeof data === 'string' ? parseISO(data) : data;
  return format(dataObj, formatStr, { locale: ptBR });
};

/**
 * Formata o valor monetário
 * @param {number} valor - Valor a ser formatado
 * @returns {string} Valor formatado
 */
const formatarValor = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

/**
 * Formata o percentual
 * @param {number} valor - Valor a ser formatado
 * @returns {string} Percentual formatado
 */
const formatarPercentual = (valor) => {
  return `${valor.toFixed(2)}%`;
};

/**
 * Exporta os dados de reajustes para Excel
 * @param {Array} reajustes - Lista de reajustes
 * @param {string} filename - Nome do arquivo
 */
export const exportarReajustesExcel = (reajustes, filename = 'reajustes.xlsx') => {
  // Preparar dados para exportação
  const dados = reajustes.map(reajuste => ({
    'Contrato': reajuste.contrato?.numero || `#${reajuste.contratoId}`,
    'Cliente': reajuste.cliente?.nome || 'Não informado',
    'Documento': reajuste.cliente?.documento || 'Não informado',
    'Data Referência': formatarData(reajuste.dataReferencia),
    'Parcela': reajuste.parcelaReferencia,
    'Valor Original': reajuste.valorOriginal,
    'Valor Reajustado': reajuste.valorReajustado,
    'Diferença': reajuste.valorReajustado - reajuste.valorOriginal,
    'Índice Base': reajuste.indiceBase || 'IGPM',
    'Valor Índice (%)': formatarPercentual(reajuste.indiceAplicado),
    'Adicional (%)': formatarPercentual(reajuste.percentualAdicional),
    'Reajuste Total (%)': formatarPercentual(reajuste.reajusteTotal),
    'Status': reajuste.status === 'aplicado' ? 'Aplicado' : 'Pendente',
    'Data Aplicação': reajuste.dataAplicacao ? formatarData(reajuste.dataAplicacao) : '-'
  }));
  
  // Criar workbook e adicionar worksheet
  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  
  // Definir largura das colunas
  const wscols = [
    { wch: 15 }, // Contrato
    { wch: 25 }, // Cliente
    { wch: 20 }, // Documento
    { wch: 15 }, // Data Referência
    { wch: 10 }, // Parcela
    { wch: 15 }, // Valor Original
    { wch: 15 }, // Valor Reajustado
    { wch: 15 }, // Diferença
    { wch: 10 }, // Índice Base
    { wch: 15 }, // Valor Índice (%)
    { wch: 15 }, // Adicional (%)
    { wch: 15 }, // Reajuste Total (%)
    { wch: 12 }, // Status
    { wch: 15 }  // Data Aplicação
  ];
  ws['!cols'] = wscols;
  
  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Reajustes');
  
  // Gerar arquivo
  XLSX.writeFile(wb, filename);
};

/**
 * Exporta o log de reajustes para JSON
 * @param {Array} reajustes - Lista de reajustes
 * @param {string} filename - Nome do arquivo
 */
export const exportarLogReajustesJSON = (reajustes, filename = 'log_reajustes.json') => {
  // Preparar dados para exportação
  const dados = {
    dataExportacao: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    totalReajustes: reajustes.length,
    reajustes: reajustes.map(reajuste => ({
      id: reajuste.id,
      contratoId: reajuste.contratoId,
      contratoNumero: reajuste.contrato?.numero || null,
      clienteId: reajuste.cliente?.id || null,
      clienteNome: reajuste.cliente?.nome || null,
      clienteDocumento: reajuste.cliente?.documento || null,
      dataReferencia: reajuste.dataReferencia,
      dataAplicacao: reajuste.dataAplicacao || null,
      parcelaReferencia: reajuste.parcelaReferencia,
      valorOriginal: reajuste.valorOriginal,
      valorReajustado: reajuste.valorReajustado,
      diferenca: reajuste.valorReajustado - reajuste.valorOriginal,
      indiceBase: reajuste.indiceBase || 'IGPM',
      indiceAplicado: reajuste.indiceAplicado,
      percentualAdicional: reajuste.percentualAdicional,
      reajusteTotal: reajuste.reajusteTotal,
      status: reajuste.status || 'pendente'
    }))
  };
  
  // Criar blob e link para download
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exporta o relatório de reajustes para PDF
 * @param {Array} reajustes - Lista de reajustes
 * @param {string} filename - Nome do arquivo
 */
export const exportarRelatorioPDF = (reajustes, filename = 'relatorio_reajustes.pdf') => {
  // Criar instância do PDF
  const doc = new jsPDF();
  
  // Adicionar título e informações
  doc.setFontSize(18);
  doc.text('Relatório de Reajustes Contratuais', 14, 22);
  
  doc.setFontSize(10);
  doc.text(`Data de geração: ${formatarData(new Date())}`, 14, 30);
  doc.text(`Total de reajustes: ${reajustes.length}`, 14, 35);
  
  // Dados para a tabela
  const dadosTabela = reajustes.map(reajuste => [
    reajuste.contrato?.numero || `#${reajuste.contratoId}`,
    reajuste.cliente?.nome || 'Não informado',
    formatarData(reajuste.dataReferencia),
    reajuste.parcelaReferencia.toString(),
    formatarValor(reajuste.valorOriginal),
    formatarValor(reajuste.valorReajustado),
    formatarPercentual(reajuste.reajusteTotal),
    reajuste.status === 'aplicado' ? 'Aplicado' : 'Pendente'
  ]);
  
  // Configuração das colunas
  const colunas = [
    'Contrato',
    'Cliente',
    'Data Ref.',
    'Parcela',
    'Valor Original',
    'Valor Reajustado',
    'Reajuste',
    'Status'
  ];
  
  // Adicionar tabela ao PDF
  doc.autoTable({
    head: [colunas],
    body: dadosTabela,
    startY: 45,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 40 },
      2: { cellWidth: 20 },
      3: { cellWidth: 15 },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 25, halign: 'right' },
      6: { cellWidth: 20, halign: 'center' },
      7: { cellWidth: 20, halign: 'center' }
    }
  });
  
  // Adicionar informações de rodapé
  const totalHeight = doc.autoTable.previous.finalY + 10;
  doc.setFontSize(9);
  doc.text('Gestão de Loteamentos - Sistema de Reajustes Automáticos', 14, totalHeight);
  doc.text(`Página 1 de 1`, doc.internal.pageSize.width - 25, totalHeight);
  
  // Salvar arquivo
  doc.save(filename);
};

/**
 * Exporta os dados de reajustes para CSV
 * @param {Array} reajustes - Lista de reajustes
 * @param {string} filename - Nome do arquivo
 */
export const exportarReajustesCSV = (reajustes, filename = 'reajustes.csv') => {
  // Cabeçalhos CSV
  const headers = [
    'Contrato',
    'Cliente',
    'Documento',
    'Data Referência',
    'Parcela',
    'Valor Original',
    'Valor Reajustado',
    'Diferença',
    'Índice Base',
    'Valor Índice (%)',
    'Adicional (%)',
    'Reajuste Total (%)',
    'Status',
    'Data Aplicação'
  ].join(';');
  
  // Linhas de dados
  const rows = reajustes.map(reajuste => [
    reajuste.contrato?.numero || `#${reajuste.contratoId}`,
    reajuste.cliente?.nome || 'Não informado',
    reajuste.cliente?.documento || 'Não informado',
    formatarData(reajuste.dataReferencia),
    reajuste.parcelaReferencia,
    reajuste.valorOriginal.toString().replace('.', ','),
    reajuste.valorReajustado.toString().replace('.', ','),
    (reajuste.valorReajustado - reajuste.valorOriginal).toString().replace('.', ','),
    reajuste.indiceBase || 'IGPM',
    reajuste.indiceAplicado.toString().replace('.', ','),
    reajuste.percentualAdicional.toString().replace('.', ','),
    reajuste.reajusteTotal.toString().replace('.', ','),
    reajuste.status === 'aplicado' ? 'Aplicado' : 'Pendente',
    reajuste.dataAplicacao ? formatarData(reajuste.dataAplicacao) : '-'
  ].join(';'));
  
  // Conteúdo completo do CSV
  const csvContent = [headers, ...rows].join('\n');
  
  // Criar blob e link para download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};