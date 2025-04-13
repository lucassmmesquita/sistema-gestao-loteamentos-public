/**
 * Valida um CPF
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} - true se válido, false se inválido
 */
export const validarCPF = (cpf) => {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
      return false;
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) {
      return false;
    }
    
    // Calcula primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    
    let resto = soma % 11;
    let dv1 = resto < 2 ? 0 : 11 - resto;
    
    // Verifica primeiro dígito verificador
    if (parseInt(cpf.charAt(9)) !== dv1) {
      return false;
    }
    
    // Calcula segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    
    resto = soma % 11;
    let dv2 = resto < 2 ? 0 : 11 - resto;
    
    // Verifica segundo dígito verificador
    return parseInt(cpf.charAt(10)) === dv2;
  };
  
  /**
   * Valida um CNPJ
   * @param {string} cnpj - CNPJ a ser validado
   * @returns {boolean} - true se válido, false se inválido
   */
  export const validarCNPJ = (cnpj) => {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    // Verifica se tem 14 dígitos
    if (cnpj.length !== 14) {
      return false;
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpj)) {
      return false;
    }
    
    // Calcula primeiro dígito verificador
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    
    // Verifica primeiro dígito verificador
    if (resultado !== parseInt(digitos.charAt(0))) {
      return false;
    }
    
    // Calcula segundo dígito verificador
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    
    // Verifica segundo dígito verificador
    return resultado === parseInt(digitos.charAt(1));
  };
  
  /**
   * Valida um CPF ou CNPJ
   * @param {string} documento - CPF ou CNPJ a ser validado
   * @returns {boolean} - true se válido, false se inválido
   */
  export const validarCPFouCNPJ = (documento) => {
    // Remove caracteres não numéricos
    const apenasNumeros = documento.replace(/[^\d]/g, '');
    
    // Verifica se é CPF ou CNPJ baseado no número de dígitos
    if (apenasNumeros.length === 11) {
      return validarCPF(apenasNumeros);
    } else if (apenasNumeros.length === 14) {
      return validarCNPJ(apenasNumeros);
    }
    
    return false;
  };
  
  /**
   * Valida um email
   * @param {string} email - Email a ser validado
   * @returns {boolean} - true se válido, false se inválido
   */
  export const validarEmail = (email) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(email);
  };
  
  /**
   * Valida um telefone
   * @param {string} telefone - Telefone a ser validado
   * @returns {boolean} - true se válido, false se inválido
   */
  export const validarTelefone = (telefone) => {
    // Remove caracteres não numéricos
    const apenasNumeros = telefone.replace(/[^\d]/g, '');
    
    // Verifica se tem entre 10 e 11 dígitos (com ou sem DDD)
    return apenasNumeros.length >= 10 && apenasNumeros.length <= 11;
  };
  
  /**
   * Valida um CEP
   * @param {string} cep - CEP a ser validado
   * @returns {boolean} - true se válido, false se inválido
   */
  export const validarCEP = (cep) => {
    // Remove caracteres não numéricos
    const apenasNumeros = cep.replace(/[^\d]/g, '');
    
    // Verifica se tem 8 dígitos
    return apenasNumeros.length === 8;
  };