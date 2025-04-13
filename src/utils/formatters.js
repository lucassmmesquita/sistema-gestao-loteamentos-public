import { format as dateFnsFormat, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata um valor como moeda brasileira
 * @param {number} value - Valor a ser formatado
 * @param {boolean} showSymbol - Se deve mostrar o símbolo da moeda
 * @returns {string} - Valor formatado
 */
export const formatCurrency = (value, showSymbol = true) => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat('pt-BR', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formata um CPF
 * @param {string} cpf - CPF a ser formatado
 * @returns {string} - CPF formatado
 */
export const formatCPF = (cpf) => {
  if (!cpf) return '';
  
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');
  
  // Formata como XXX.XXX.XXX-XX
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata um CNPJ
 * @param {string} cnpj - CNPJ a ser formatado
 * @returns {string} - CNPJ formatado
 */
export const formatCNPJ = (cnpj) => {
  if (!cnpj) return '';
  
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  // Formata como XX.XXX.XXX/XXXX-XX
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/**
 * Formata um CPF ou CNPJ automaticamente
 * @param {string} documento - CPF ou CNPJ a ser formatado
 * @returns {string} - Documento formatado
 */
export const formatCPFouCNPJ = (documento) => {
  if (!documento) return '';
  
  // Remove caracteres não numéricos
  const apenasNumeros = documento.replace(/[^\d]/g, '');
  
  // Verifica se é CPF ou CNPJ baseado no número de dígitos
  if (apenasNumeros.length <= 11) {
    return formatCPF(apenasNumeros);
  } else {
    return formatCNPJ(apenasNumeros);
  }
};

/**
 * Formata um telefone
 * @param {string} telefone - Telefone a ser formatado
 * @returns {string} - Telefone formatado
 */
export const formatTelefone = (telefone) => {
  if (!telefone) return '';
  
  // Remove caracteres não numéricos
  telefone = telefone.replace(/[^\d]/g, '');
  
  // Formata baseado no tamanho
  if (telefone.length === 10) {
    // Telefone sem 9 (fixo)
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (telefone.length === 11) {
    // Telefone com 9 (celular)
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  // Retorna sem formatação se não se encaixar nos padrões
  return telefone;
};

/**
 * Formata um CEP
 * @param {string} cep - CEP a ser formatado
 * @returns {string} - CEP formatado
 */
export const formatCEP = (cep) => {
  if (!cep) return '';
  
  // Remove caracteres não numéricos
  cep = cep.replace(/[^\d]/g, '');
  
  // Formata como XXXXX-XXX
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Formata uma data para exibição
 * @param {string|Date} date - Data a ser formatada (ISO ou objeto Date)
 * @param {string} formatStr - Formato desejado (padrão dd/MM/yyyy)
 * @returns {string} - Data formatada
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '';
  
  try {
    // Se for string ISO, converte para Date
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    return dateFnsFormat(dateObj, formatStr, { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
};

/**
 * Converte uma string de data no formato dd/MM/yyyy para ISO
 * @param {string} dateStr - Data no formato dd/MM/yyyy
 * @returns {string} - Data no formato ISO
 */
export const convertDateToISO = (dateStr) => {
  if (!dateStr) return '';
  
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};