// src/services/storageService.js

import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import api from './api';

// Configuração do AWS S3
const configureS3 = () => {
  // Configurações do S3
  return new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });
};

const storageService = {
  /**
   * Faz upload de um arquivo para o S3
   * @param {File} file - Arquivo a ser enviado
   * @param {number} clienteId - ID do cliente
   * @param {string} tipoDocumento - Tipo do documento
   * @returns {Promise} Promise com os dados do upload
   */
  uploadFile: async (file, clienteId, tipoDocumento) => {
    try {
      // Em ambiente de desenvolvimento, podemos usar a API diretamente
      if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_S3) {
        // Cria um FormData para enviar o arquivo
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tipoDocumento', tipoDocumento);
        
        const response = await api.post(`/documentos/upload/${clienteId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        return response.data;
      }
      
      // Em produção, usa o S3
      const s3 = configureS3();
      
      // Gera um nome único para o arquivo
      const fileName = `${uuidv4()}-${file.name}`;
      
      // Define o caminho no S3 (organizando por cliente)
      const filePath = `clientes/${clienteId}/documentos/${tipoDocumento}/${fileName}`;
      
      // Configuração do upload
      const params = {
        Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
        Key: filePath,
        Body: file,
        ContentType: file.type,
        ACL: 'private' // Restringe o acesso
      };
      
      // Faz o upload para o S3
      const uploadResult = await s3.upload(params).promise();
      
      // Registra o documento no backend
      const documentoData = {
        clienteId: clienteId,
        tipo: tipoDocumento,
        nomeArquivo: file.name,
        tamanho: file.size,
        tipoArquivo: file.type,
        url: uploadResult.Location,
        s3Key: uploadResult.Key
      };
      
      const response = await api.post('/documentos', documentoData);
      
      return {
        ...response.data,
        // Permitimos visualização temporária
        urlTemporaria: await storageService.getSignedUrl(uploadResult.Key)
      };
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      throw error;
    }
  },
  
  /**
   * Obtém uma URL assinada para acesso temporário ao arquivo no S3
   * @param {string} key - Chave do arquivo no S3
   * @param {number} expiresIn - Tempo de expiração em segundos (padrão: 1 hora)
   * @returns {Promise<string>} URL assinada
   */
  getSignedUrl: async (key, expiresIn = 3600) => {
    try {
      const s3 = configureS3();
      
      const params = {
        Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
        Key: key,
        Expires: expiresIn
      };
      
      return s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      console.error('Erro ao gerar URL assinada:', error);
      throw error;
    }
  },
  
  /**
   * Remove um arquivo do S3
   * @param {string} key - Chave do arquivo no S3
   * @returns {Promise} Resultado da operação
   */
  deleteFile: async (key) => {
    try {
      // Em desenvolvimento, usa a API diretamente
      if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_S3) {
        const documentoId = key; // Em dev, a chave é o ID do documento
        const response = await api.delete(`/documentos/${documentoId}`);
        return response.data;
      }
      
      // Em produção, remove do S3 e depois atualiza o banco
      const s3 = configureS3();
      
      const params = {
        Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
        Key: key
      };
      
      await s3.deleteObject(params).promise();
      
      // Notifica o backend sobre a deleção
      const response = await api.delete(`/documentos/s3/${encodeURIComponent(key)}`);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
      throw error;
    }
  }
};

export default storageService;