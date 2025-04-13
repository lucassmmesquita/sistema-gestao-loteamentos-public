import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Serviço para importação e exportação de dados em diferentes formatos
 */
const importExportService = {
  /**
   * Importa dados de um arquivo CSV ou XLSX
   * @param {File} arquivo - Arquivo a ser importado
   * @returns {Promise} Promise com os dados importados
   */
  importarArquivo: async (arquivo) => {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Pega a primeira planilha
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Converte para JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
              header: 1,
              defval: ''
            });
            
            // Se não há dados, retorna erro
            if (jsonData.length < 2) {
              reject(new Error('Arquivo vazio ou sem dados válidos'));
              return;
            }
            
            // Extrai os cabeçalhos (primeira linha)
            const headers = jsonData[0];
            
            // Mapeia os dados em objetos com os cabeçalhos como chaves
            const result = jsonData.slice(1).map((row) => {
              const obj = {};
              headers.forEach((header, index) => {
                if (header) {
                  obj[header] = row[index];
                }
              });
              return obj;
            });
            
            resolve(result);
          } catch (error) {
            reject(new Error(`Erro ao processar arquivo: ${error.message}`));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Erro ao ler arquivo'));
        };
        
        reader.readAsArrayBuffer(arquivo);
      });
    } catch (error) {
      console.error('Erro ao importar arquivo:', error);
      throw new Error(`Falha ao importar arquivo: ${error.message}`);
    }
  },

  /**
   * Exporta dados para um arquivo Excel (XLSX)
   * @param {Array} dados - Dados a serem exportados
   * @param {string} nomeArquivo - Nome do arquivo (sem extensão)
   * @param {Object} opcoesExportacao - Opções adicionais para exportação
   * @returns {Blob} Blob do arquivo XLSX
   */
  exportarParaExcel: (dados, nomeArquivo = 'exportacao', opcoesExportacao = {}) => {
    try {
      // Cria uma nova planilha
      const workbook = XLSX.utils.book_new();
      
      // Adiciona os dados à planilha
      const worksheet = XLSX.utils.json_to_sheet(dados);
      
      // Configurações de coluna (opcional)
      if (opcoesExportacao.colunas) {
        worksheet['!cols'] = opcoesExportacao.colunas.map(coluna => ({ wch: coluna.largura }));
      }
      
      // Adiciona a planilha ao workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, opcoesExportacao.nomePlanilha || 'Dados');
      
      // Converte para um blob
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Se autoDownload estiver habilitado, inicia o download
      if (opcoesExportacao.autoDownload !== false) {
        saveAs(blob, `${nomeArquivo}.xlsx`);
      }
      
      return blob;
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      throw new Error(`Falha ao exportar para Excel: ${error.message}`);
    }
  },

  /**
   * Exporta dados para um arquivo CSV
   * @param {Array} dados - Dados a serem exportados
   * @param {string} nomeArquivo - Nome do arquivo (sem extensão)
   * @param {Object} opcoesExportacao - Opções adicionais para exportação
   * @returns {Blob} Blob do arquivo CSV
   */
  exportarParaCSV: (dados, nomeArquivo = 'exportacao', opcoesExportacao = {}) => {
    try {
      // Converte dados para formato CSV com XLSX
      const worksheet = XLSX.utils.json_to_sheet(dados);
      const csvContent = XLSX.utils.sheet_to_csv(worksheet, { 
        FS: opcoesExportacao.separador || ',',
        RS: '\n'
      });
      
      // Cria um Blob com os dados CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      
      // Se autoDownload estiver habilitado, inicia o download
      if (opcoesExportacao.autoDownload !== false) {
        saveAs(blob, `${nomeArquivo}.csv`);
      }
      
      return blob;
    } catch (error) {
      console.error('Erro ao exportar para CSV:', error);
      throw new Error(`Falha ao exportar para CSV: ${error.message}`);
    }
  },

  /**
   * Exporta dados para um arquivo PDF
   * @param {Array} dados - Dados a serem exportados
   * @param {string} nomeArquivo - Nome do arquivo (sem extensão)
   * @param {Object} opcoesExportacao - Opções adicionais para exportação
   * @returns {Blob} Blob do arquivo PDF
   */
  exportarParaPDF: (dados, nomeArquivo = 'exportacao', opcoesExportacao = {}) => {
    try {
      // Cria um novo documento PDF
      const doc = new jsPDF(opcoesExportacao.orientacao || 'portrait');
      
      // Define as colunas (cabeçalhos) e linhas (dados)
      const colunas = opcoesExportacao.colunas || Object.keys(dados[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        dataKey: key
      }));
      
      // Adiciona o título (opcional)
      if (opcoesExportacao.titulo) {
        doc.setFontSize(18);
        doc.text(opcoesExportacao.titulo, 14, 22);
        doc.setFontSize(12);
        doc.text(new Date().toLocaleDateString(), 14, 30);
      }
      
      // Define o conteúdo da tabela
      const conteudo = dados.map(item => {
        return colunas.map(coluna => item[coluna.dataKey]);
      });
      
      // Adiciona a tabela ao PDF
      doc.autoTable({
        head: [colunas.map(coluna => coluna.header)],
        body: conteudo,
        startY: opcoesExportacao.titulo ? 35 : 14,
        margin: { top: 15 },
        styles: { overflow: 'linebreak' },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        ...opcoesExportacao.estilosTabela
      });
      
      // Se autoDownload estiver habilitado, inicia o download
      if (opcoesExportacao.autoDownload !== false) {
        doc.save(`${nomeArquivo}.pdf`);
      }
      
      // Retorna o PDF como um blob
      const blob = doc.output('blob');
      return blob;
    } catch (error) {
      console.error('Erro ao exportar para PDF:', error);
      throw new Error(`Falha ao exportar para PDF: ${error.message}`);
    }
  },

  /**
   * Gera um modelo de planilha para importação de pagamentos
   * @returns {Blob} Blob da planilha modelo
   */
  gerarModeloImportacaoPagamentos: () => {
    try {
      // Cria uma nova planilha
      const workbook = XLSX.utils.book_new();
      
      // Define os cabeçalhos da planilha
      const headers = [
        'nossoNumero',
        'valorPago',
        'dataPagamento',
        'formaPagamento',
        'observacoes'
      ];
      
      // Cria dados de exemplo
      const exampleData = [
        {
          nossoNumero: '12345678901234567890',
          valorPago: 1500.75,
          dataPagamento: '2023-05-15',
          formaPagamento: 'Transferência',
          observacoes: 'Pagamento via PIX'
        },
        {
          nossoNumero: '09876543210987654321',
          valorPago: 890.40,
          dataPagamento: '2023-05-16',
          formaPagamento: 'Boleto',
          observacoes: 'Comprovante enviado por e-mail'
        }
      ];
      
      // Cria a planilha com cabeçalhos e dados de exemplo
      const worksheet = XLSX.utils.json_to_sheet([...exampleData], { 
        header: headers
      });
      
      // Adiciona a planilha ao workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Modelo de Importação');
      
      // Cria uma planilha de instruções
      const instructionsWs = XLSX.utils.aoa_to_sheet([
        ['INSTRUÇÕES PARA IMPORTAÇÃO DE PAGAMENTOS'],
        [''],
        ['1. Use a planilha "Modelo de Importação" como base para seus dados.'],
        ['2. O campo "nossoNumero" é obrigatório e deve corresponder ao número do boleto.'],
        ['3. O campo "valorPago" deve conter o valor pago, usando ponto como separador decimal.'],
        ['4. O campo "dataPagamento" deve estar no formato AAAA-MM-DD.'],
        ['5. O campo "formaPagamento" é opcional e pode conter o meio de pagamento utilizado.'],
        ['6. O campo "observacoes" é opcional e pode conter informações adicionais.'],
        [''],
        ['Não altere o nome das colunas para garantir a importação correta dos dados.']
      ]);
      
      // Adiciona a planilha de instruções ao workbook
      XLSX.utils.book_append_sheet(workbook, instructionsWs, 'Instruções');
      
      // Converte para um blob
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      return blob;
    } catch (error) {
      console.error('Erro ao gerar modelo de importação:', error);
      throw new Error(`Falha ao gerar modelo de importação: ${error.message}`);
    }
  }
};

export default importExportService;