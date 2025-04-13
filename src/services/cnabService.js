import caixaService from './caixaService';

/**
 * Serviço para manipulação de arquivos CNAB 240
 */
const cnabService = {
  /**
   * Gera um arquivo de remessa CNAB 240 para boletos selecionados
   * @param {Array} boletos - Boletos a serem incluídos na remessa
   * @param {Object} cabecalho - Informações do cabeçalho do arquivo
   * @returns {Promise} Promise com o blob do arquivo de remessa gerado
   */
  gerarArquivoRemessa: async (boletos, cabecalho = {}) => {
    try {
      // Em um cenário real, a geração de arquivo CNAB seria mais complexa
      // Aqui simulamos uma estrutura simplificada
      
      const dataGeracao = new Date().toISOString().substring(0, 10).replace(/-/g, '');
      const numeroSequencial = cabecalho.numeroSequencial || Math.floor(Math.random() * 999999).toString().padStart(6, '0');
      
      // Monta o cabeçalho do arquivo (Header de Arquivo)
      const headerArquivo = [
        '104',                                      // Código do banco (Caixa = 104)
        '0000',                                     // Lote de serviço
        '0',                                        // Tipo de registro (0 = header de arquivo)
        '         ',                                // CNAB - Uso exclusivo
        '2',                                        // Tipo de inscrição (1 = CPF, 2 = CNPJ)
        caixaService.config.cnpj.replace(/\D/g, '').padStart(14, '0'), // Número de inscrição (CNPJ)
        caixaService.config.codigoBeneficiario.padStart(20, ' '), // Código do beneficiário na Caixa
        caixaService.config.agencia.padStart(5, '0'), // Agência
        ' ',                                        // Dígito da agência
        caixaService.config.conta.replace(/\D/g, '').padStart(12, '0'), // Número da conta
        ' ',                                        // Dígito da conta
        ' ',                                        // Dígito da agência/conta
        'NOME DA EMPRESA CEDENTE'.padEnd(30, ' '),  // Nome da empresa
        'CAIXA ECONOMICA FEDERAL'.padEnd(30, ' '),  // Nome do banco
        '          ',                               // CNAB - Uso exclusivo
        '1',                                        // Código do arquivo (1 = remessa)
        dataGeracao,                                // Data de geração
        '      ',                                   // Hora de geração
        numeroSequencial,                           // Número sequencial do arquivo
        '040',                                      // Versão do layout (CNAB 240)
        '     ',                                    // Densidade de gravação
        '                                                                                               '
      ].join('');
      
      // Monta as linhas para cada boleto
      const detalhes = boletos.map((boleto, index) => {
        const sequencialRegistro = (index + 1).toString().padStart(5, '0');
        const valorBoleto = Math.round(boleto.valor * 100).toString().padStart(15, '0');
        const dataVencimento = new Date(boleto.dataVencimento).toISOString().substring(0, 10).replace(/-/g, '');
        
        // Linha de detalhe do boleto (segmento P)
        const segmentoP = [
          '104',                                    // Código do banco
          '0001',                                   // Lote de serviço
          '3',                                      // Tipo de registro (3 = detalhe)
          sequencialRegistro,                       // Nº do registro
          'P',                                      // Código do segmento
          ' ',                                      // CNAB - Uso exclusivo
          '01',                                     // Código da instrução
          caixaService.config.agencia.padStart(5, '0'), // Agência
          ' ',                                      // Dígito da agência
          caixaService.config.conta.replace(/\D/g, '').padStart(12, '0'), // Número da conta
          ' ',                                      // Dígito da conta
          ' ',                                      // Dígito da agência/conta
          boleto.nossoNumero.padStart(20, '0'),     // Nosso número - identificação do título no banco
          caixaService.config.carteira,             // Código da carteira
          '0',                                      // Cadastramento no banco
          '2',                                      // Tipo de documento
          '0',                                      // Emissão do boleto
          '0',                                      // Entrega do boleto
          boleto.numeroDocumento.padEnd(15, ' '),   // Número do documento
          dataVencimento,                           // Data de vencimento
          valorBoleto,                              // Valor nominal do título
          '00000',                                  // Agência encarregada da cobrança
          '0',                                      // Dígito da agência
          '02',                                     // Espécie do título (02 = Duplicata mercantil)
          'N',                                      // Aceite (A = sim, N = não)
          dataGeracao,                              // Data de emissão
          '1',                                      // Código para juros (1 = valor por dia)
          '00000000',                               // Data do juros
          '000000000000000',                        // Valor do juros
          '0',                                      // Código para desconto
          '00000000',                               // Data do desconto
          '000000000000000',                        // Valor do desconto
          '000000000000000',                        // Valor do IOF
          '000000000000000',                        // Valor do abatimento
          boleto.descricao.padEnd(25, ' '),         // Identificação do título na empresa
          '3',                                      // Código para protesto (3 = não protestar)
          '00',                                     // Número de dias para protesto
          '0',                                      // Código para baixa/devolução
          '000',                                    // Número de dias para baixa/devolução
          '09',                                     // Código da moeda (09 = Real)
          '0000000000',                             // Número do contrato
          ' '                                       // CNAB - Uso exclusivo
        ].join('');
        
        // Linha de detalhe do boleto (segmento Q - informações do sacado)
        const segmentoQ = [
          '104',                                    // Código do banco
          '0001',                                   // Lote de serviço
          '3',                                      // Tipo de registro (3 = detalhe)
          (Number(sequencialRegistro) + 1).toString().padStart(5, '0'), // Nº do registro
          'Q',                                      // Código do segmento
          ' ',                                      // CNAB - Uso exclusivo
          '01',                                     // Código da instrução
          boleto.tipoPessoa === 'fisica' ? '1' : '2', // Tipo de inscrição (1 = CPF, 2 = CNPJ)
          boleto.documentoPagador.replace(/\D/g, '').padStart(15, '0'), // Número de inscrição
          boleto.nomePagador.padEnd(40, ' '),       // Nome do pagador
          boleto.enderecoPagador.padEnd(40, ' '),   // Endereço
          boleto.bairroPagador.padEnd(15, ' '),     // Bairro
          boleto.cepPagador.replace(/\D/g, '').padStart(8, '0'), // CEP
          boleto.cidadePagador.padEnd(15, ' '),     // Cidade
          boleto.ufPagador.padEnd(2, ' '),          // UF
          '0',                                      // Tipo de inscrição do sacador/avalista
          '000000000000000',                        // Número de inscrição do sacador/avalista
          '                                        ', // Nome do sacador/avalista
          '000',                                    // Código do banco correspondente
          '00000000000000000000',                   // Nosso número no banco correspondente
          '        '                                // CNAB - Uso exclusivo
        ].join('');
        
        return segmentoP + '\r\n' + segmentoQ;
      }).join('\r\n');
      
      // Monta o trailer de arquivo
      const trailerArquivo = [
        '104',                                      // Código do banco
        '9999',                                     // Lote de serviço
        '9',                                        // Tipo de registro (9 = trailer de arquivo)
        '         ',                                // CNAB - Uso exclusivo
        '000001',                                   // Quantidade de lotes
        (boletos.length * 2 + 2).toString().padStart(6, '0'), // Quantidade de registros
        '000000',                                   // Quantidade de contas para conciliação
        '                                                                                                                                                                                                   '
      ].join('');
      
      // Monta o arquivo completo
      const conteudoArquivo = headerArquivo + '\r\n' + detalhes + '\r\n' + trailerArquivo;
      
      // Cria o arquivo como um Blob
      const blob = new Blob([conteudoArquivo], { type: 'text/plain' });
      
      return {
        blob,
        nomeArquivo: `REMESSA_${dataGeracao}_${numeroSequencial}.REM`,
        conteudo: conteudoArquivo,
        quantidadeRegistros: boletos.length,
        valorTotal: boletos.reduce((total, boleto) => total + Number(boleto.valor), 0).toFixed(2)
      };
    } catch (error) {
      console.error('Erro ao gerar arquivo de remessa:', error);
      throw new Error(`Falha ao gerar arquivo de remessa: ${error.message}`);
    }
  },

  /**
   * Processa um arquivo de retorno CNAB 240
   * @param {File|Blob} arquivo - Arquivo de retorno a ser processado
   * @returns {Promise} Promise com o resultado do processamento
   */
  processarArquivoRetorno: async (arquivo) => {
    try {
      // Lê o conteúdo do arquivo
      const conteudo = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Erro ao ler arquivo de retorno'));
        reader.readAsText(arquivo);
      });
      
      // Em um cenário real, faria a interpretação linha a linha do arquivo CNAB
      // Aqui simplificamos para focar na estrutura da aplicação
      
      // Envia para a API da Caixa para processamento
      const resultado = await caixaService.processarArquivoRetorno(arquivo);
      
      return {
        protocolo: resultado.protocolo,
        dataProcessamento: resultado.dataProcessamento,
        quantidadeRegistros: resultado.quantidadeRegistros,
        registrosProcessados: resultado.registrosProcessados,
        linhasArquivo: conteudo.split('\r\n').length
      };
    } catch (error) {
      console.error('Erro ao processar arquivo de retorno:', error);
      throw new Error(`Falha ao processar arquivo de retorno: ${error.message}`);
    }
  }
};

export default cnabService;