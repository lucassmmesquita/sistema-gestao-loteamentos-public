#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

// Configurações
const CONFIG = {
  lotesFile: path.resolve(__dirname, '../../../LOTES.xlsx'),
  clientesFile: path.resolve(__dirname, '../../../Clientes.xlsx'),
  contratosFile: path.resolve(__dirname, '../../../Contratos.xlsx'),
};

// Função auxiliar para converter Excel date para JS Date
function excelDateToJSDate(excelDate) {
  if (!excelDate) return null;
  if (typeof excelDate === 'string') {
    // Tenta converter um formato de data formatada (DD/MM/YYYY)
    if (excelDate.includes('/')) {
      const [day, month, year] = excelDate.split('/');
      return new Date(`${year}-${month}-${day}`);
    }
    // Pode já estar em formato ISO
    return new Date(excelDate);
  }
  // Converte a data numérica do Excel
  return new Date(Math.round((excelDate - 25569) * 86400 * 1000));
}

// Implementação da importação de lotes
async function importLotes() {
  console.log('Importando lotes...');
  
  const workbook = XLSX.readFile(CONFIG.lotesFile);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);
  
  let created = 0;
  let updated = 0;
  let errors = 0;
  
  for (const row of rows) {
    try {
      // Verificar se o lote já existe pela chave
      const existingLote = await prisma.lote.findFirst({
        where: { chave: String(row.chave) }
      });
      
      const loteData = {
        numero: String(row.Lotes || ''),
        quadra: String(row.Quadras || ''),
        area: Number(row['Area m2'] || 0),
        chave: String(row.chave || ''),
        loteamento: 'Importado', // Valor padrão
        valorBase: 0, // Valor padrão
        status: 'disponivel'
      };
      
      if (existingLote) {
        // Atualizar lote existente
        await prisma.lote.update({
          where: { id: existingLote.id },
          data: loteData
        });
        updated++;
      } else {
        // Criar novo lote
        await prisma.lote.create({ data: loteData });
        created++;
      }
    } catch (err) {
      console.error(`Erro ao importar lote: ${row.chave}`, err);
      errors++;
    }
  }
  
  console.log(`Lotes importados com sucesso: ${created} criados, ${updated} atualizados, ${errors} com erro`);
}

// Implementação da importação de clientes
async function importClientes() {
  console.log('Importando clientes...');
  
  const workbook = XLSX.readFile(CONFIG.clientesFile);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);
  
  let created = 0;
  let updated = 0;
  let errors = 0;
  
  for (const row of rows) {
    try {
      // Verificar se o cliente já existe pelo ID
      const existingCliente = await prisma.cliente.findUnique({
        where: { id: Number(row.IDCliente) }
      });
      
      const clienteData = {
        nome: String(row.nome_comprador || ''),
        nomeConjuge: String(row.nome_conjuge || ''),
        profissao: String(row.profissao || ''),
        dataNascimento: row.data_nascimento ? excelDateToJSDate(row.data_nascimento) : null,
        cpfCnpj: existingCliente?.cpfCnpj || `IMPORTADO-${row.IDCliente}`
      };
      
      // Preparar dados de endereço
      const enderecoData = (row.bairro || row.estado || row.cep || row.endereco_cliente)
        ? {
            bairro: String(row.bairro || ''),
            estado: String(row.estado || ''),
            cep: String(row.cep || ''),
            logradouro: String(row.endereco_cliente || ''),
            numero: '0', // Obrigatório mas não temos na importação
            cidade: 'Importado' // Obrigatório mas não temos na importação
          }
        : null;
      
      if (existingCliente) {
        // Atualizar cliente existente
        await prisma.cliente.update({
          where: { id: existingCliente.id },
          data: {
            ...clienteData,
            endereco: enderecoData
              ? {
                  upsert: {
                    create: enderecoData,
                    update: enderecoData
                  }
                }
              : undefined
          }
        });
        updated++;
      } else {
        // Criar novo cliente
        await prisma.cliente.create({
          data: {
            ...clienteData,
            id: Number(row.IDCliente), // Definir ID específico
            endereco: enderecoData 
              ? {
                  create: enderecoData
                } 
              : undefined
          }
        });
        created++;
      }
    } catch (err) {
      console.error(`Erro ao importar cliente: ${row.IDCliente}`, err);
      errors++;
    }
  }
  
  console.log(`Clientes importados com sucesso: ${created} criados, ${updated} atualizados, ${errors} com erro`);
}

// Implementação da importação de contratos
async function importContratos() {
  console.log('Importando contratos...');
  
  const workbook = XLSX.readFile(CONFIG.contratosFile);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);
  
  let created = 0;
  let updated = 0;
  let errors = 0;
  
  for (const row of rows) {
    try {
      // Verificar se o contrato já existe pelo número
      const existingContrato = await prisma.contrato.findFirst({
        where: { numeroContrato: String(row.numero_contrato) }
      });
      
      // Buscar o lote pela chave
      const lote = await prisma.lote.findFirst({
        where: { chave: String(row.chave) }
      });
      
      if (!lote) {
        console.error(`Lote não encontrado para o contrato: ${row.numero_contrato}, chave: ${row.chave}`);
        errors++;
        continue;
      }
      
      // Preparar dados do contrato
      const contratoData = {
        clienteId: Number(row.IDCliente),
        loteId: lote.id,
        chave: String(row.chave || ''),
        numeroContrato: String(row.numero_contrato || ''),
        dataEmissao: row.data_emissao ? excelDateToJSDate(row.data_emissao) : null,
        valorTotal: Number(row.valor_contrato || 0),
        numeroParcelas: Number(row.numero_parcelas || 0),
        dataPrimeiraPrestacao: row.data_primeira_prestacao ? excelDateToJSDate(row.data_primeira_prestacao) : null,
        valorPrestacao: Number(row.valor_prestacao || 0),
        // Campos obrigatórios - valores padrão
        dataInicio: row.data_primeira_prestacao ? excelDateToJSDate(row.data_primeira_prestacao) : new Date(),
        dataFim: row.data_primeira_prestacao && row.numero_parcelas 
          ? new Date(new Date(excelDateToJSDate(row.data_primeira_prestacao)).setMonth(
              excelDateToJSDate(row.data_primeira_prestacao).getMonth() + Number(row.numero_parcelas || 0)
            )) 
          : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        valorEntrada: 0, // Valor padrão
        dataVencimento: row.data_primeira_prestacao 
          ? excelDateToJSDate(row.data_primeira_prestacao).getDate() 
          : 10, // Valor padrão
        clausulas: 'Importado automaticamente' // Valor padrão
      };
      
      if (existingContrato) {
        // Atualizar contrato existente
        await prisma.contrato.update({
          where: { id: existingContrato.id },
          data: contratoData
        });
        updated++;
      } else {
        // Criar novo contrato
        await prisma.contrato.create({
          data: contratoData
        });
        created++;
      }
    } catch (err) {
      console.error(`Erro ao importar contrato: ${row.numero_contrato}`, err);
      errors++;
    }
  }
  
  console.log(`Contratos importados com sucesso: ${created} criados, ${updated} atualizados, ${errors} com erro`);
}

// Função principal
async function main() {
  console.log('Iniciando importação de dados...');
  
  try {
    // Verificar se os arquivos existem
    if (!fs.existsSync(CONFIG.lotesFile)) {
      console.error(`Arquivo de lotes não encontrado: ${CONFIG.lotesFile}`);
      return;
    }
    
    if (!fs.existsSync(CONFIG.clientesFile)) {
      console.error(`Arquivo de clientes não encontrado: ${CONFIG.clientesFile}`);
      return;
    }
    
    if (!fs.existsSync(CONFIG.contratosFile)) {
      console.error(`Arquivo de contratos não encontrado: ${CONFIG.contratosFile}`);
      return;
    }
    
    // Importar dados na ordem correta
    await importLotes();
    await importClientes();
    await importContratos();
    
    console.log('Importação concluída com sucesso!');
  } catch (err) {
    console.error('Erro durante a importação:', err);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script
main();