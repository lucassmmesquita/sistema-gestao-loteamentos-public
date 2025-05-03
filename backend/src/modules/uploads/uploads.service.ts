// backend/src/modules/uploads/uploads.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async saveContratoFile(file: Express.Multer.File, contratoId: number, userId: number) {
    // Em um ambiente real, você pode fazer upload para um serviço de armazenamento como S3
    // Aqui vamos simular com armazenamento local
    const baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3001';
    const fileUrl = `${baseUrl}/uploads/contratos/${file.filename}`;
    
    // Registramos o arquivo no banco de dados
    const documento = await this.prisma.documento.create({
      data: {
        clienteId: 0, // Será atualizado abaixo
        tipo: 'contrato',
        nome: file.originalname,
        arquivo: file.filename,
        dataUpload: new Date(),
        s3Key: file.path
      }
    });
    
    // Buscar o contrato para obter o clienteId
    const contrato = await this.prisma.contrato.findUnique({
      where: { id: Number(contratoId) },
      select: { clienteId: true }
    });
    
    // Atualizar o clienteId no documento
    if (contrato) {
      await this.prisma.documento.update({
        where: { id: documento.id },
        data: { clienteId: contrato.clienteId }
      });
    }
    
    return { fileUrl, documentoId: documento.id };
  }

  async saveDocumentoFile(file: Express.Multer.File, contratoId: number, tipo: string, userId: number) {
    // Similar ao método anterior, mas para outros tipos de documentos
    const baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3001';
    const fileUrl = `${baseUrl}/uploads/documentos/${file.filename}`;
    
    // Buscar o contrato para obter o clienteId
    const contrato = await this.prisma.contrato.findUnique({
      where: { id: Number(contratoId) },
      select: { clienteId: true }
    });
    
    if (!contrato) {
      throw new Error('Contrato não encontrado');
    }
    
    // Registramos o arquivo no banco de dados
    const documento = await this.prisma.documento.create({
      data: {
        clienteId: contrato.clienteId,
        tipo: tipo || 'outros',
        nome: file.originalname,
        arquivo: file.filename,
        dataUpload: new Date(),
        s3Key: file.path
      }
    });
    
    return { fileUrl, documentoId: documento.id };
  }
}