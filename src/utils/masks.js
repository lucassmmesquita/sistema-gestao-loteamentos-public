/**
 * Máscaras para serem usadas com o componente InputMask
 */

// Máscara para CPF: 999.999.999-99
export const cpfMask = '999.999.999-99';

// Máscara para CNPJ: 99.999.999/9999-99
export const cnpjMask = '99.999.999/9999-99';

// Máscara para telefone: (99) 9999-9999 ou (99) 99999-9999
export const telefoneMask = (value) => {
  if (!value) return '';
  
  const onlyNumbers = value.replace(/[^\d]/g, '');
  return onlyNumbers.length <= 10 
    ? '(99) 9999-9999' 
    : '(99) 99999-9999';
};

// Máscara para CEP: 99999-999
export const cepMask = '99999-999';

// Máscara para data: 99/99/9999
export const dataMask = '99/99/9999';

// Máscara para dinheiro brasileño: R$ 9.999,99
export const moneyMask = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d)(\d{2})$/, '$1,$2')
    .replace(/(?=(\d{3})+(\D))\B/g, '.');
};

/**
 * Determina automaticamente a máscara de CPF ou CNPJ
 * @param {string} value - Valor para determinar a máscara
 * @returns {string} - Máscara apropriada
 */
export const cpfCnpjMask = (value) => {
  if (!value) return '';
  
  const onlyNumbers = value.replace(/[^\d]/g, '');
  return onlyNumbers.length <= 11 ? cpfMask : cnpjMask;
};

/**
 * Remove a máscara de qualquer string
 * @param {string} value - Valor com máscara
 * @returns {string} - Valor sem máscara
 */
export const removeMask = (value) => {
  if (!value) return '';
  return value.replace(/[^\d]/g, '');
};