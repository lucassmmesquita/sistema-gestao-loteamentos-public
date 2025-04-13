/**
 * Converte um arquivo para base64
 * @param {File} file - Arquivo a ser convertido
 * @returns {Promise} Promise com a string base64
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  
  /**
   * Converte tamanho em bytes para formato legível
   * @param {number} bytes - Tamanho em bytes
   * @param {number} decimals - Número de casas decimais
   * @returns {string} Tamanho formatado
   */
  export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  /**
   * Extrai a extensão de um arquivo
   * @param {string} filename - Nome do arquivo
   * @returns {string} Extensão do arquivo
   */
  export const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
  };
  
  /**
   * Valida se um arquivo tem o tipo permitido
   * @param {File} file - Arquivo a ser validado
   * @param {Array} allowedTypes - Tipos de arquivos permitidos
   * @returns {boolean} Verdadeiro se o arquivo for válido
   */
  export const isValidFileType = (file, allowedTypes) => {
    const extension = getFileExtension(file.name);
    return allowedTypes.includes(extension);
  };
  
  /**
   * Valida se um arquivo tem o tamanho permitido
   * @param {File} file - Arquivo a ser validado
   * @param {number} maxSizeInMB - Tamanho máximo em MB
   * @returns {boolean} Verdadeiro se o arquivo for válido
   */
  export const isValidFileSize = (file, maxSizeInMB) => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  };
  
  /**
   * Gera um nome de arquivo único
   * @param {string} originalName - Nome original do arquivo
   * @returns {string} Nome de arquivo único
   */
  export const generateUniqueFileName = (originalName) => {
    const extension = getFileExtension(originalName);
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `${timestamp}_${random}.${extension}`;
  };
  
  /**
   * Detecta o tipo de arquivo CSV ou XLSX
   * @param {File} file - Arquivo a ser analisado
   * @returns {Promise<string>} Promise com o tipo de arquivo ('csv', 'xlsx' ou 'unknown')
   */
  export const detectFileType = async (file) => {
    // Verifica pela extensão primeiro
    const extension = getFileExtension(file.name);
    if (['csv', 'xlsx', 'xls'].includes(extension)) {
      return extension === 'csv' ? 'csv' : 'xlsx';
    }
    
    // Se não for possível determinar pela extensão, tenta ler os primeiros bytes
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target.result;
        const bytes = new Uint8Array(buffer).subarray(0, 4);
        let header = '';
        for (let i = 0; i < bytes.length; i++) {
          header += bytes[i].toString(16);
        }
        
        // Assinaturas comuns de arquivos
        if (header.startsWith('504b0304')) {
          resolve('xlsx'); // Arquivo ZIP (provavelmente XLSX)
        } else if (header.startsWith('d0cf11e0')) {
          resolve('xlsx'); // Arquivo XLS antigo
        } else {
          // Tenta detectar CSV pela presença de vírgulas ou ponto-e-vírgulas nas primeiras linhas
          const textReader = new FileReader();
          textReader.onload = (e) => {
            const text = e.target.result;
            const firstLines = text.slice(0, 100);
            if (firstLines.includes(',') || firstLines.includes(';')) {
              resolve('csv');
            } else {
              resolve('unknown');
            }
          };
          textReader.readAsText(file.slice(0, 100));
        }
      };
      reader.onerror = () => resolve('unknown');
      reader.readAsArrayBuffer(file.slice(0, 4));
    });
  };