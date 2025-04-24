// backend/src/modules/documentos/documentos.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { join, basename } from 'path';
import { existsSync, mkdirSync, renameSync } from 'fs';

@Injectable()
export class DocumentosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDocumentoDto: CreateDocumentoDto) {
    return this.prisma.documento.create({
      data: createDocumentoDto,
    });
  }

  async findAll(clienteId?: number) {
    if (clienteId) {
      return this.prisma.documento.findMany({
        where: { clienteId },
      });
    }
    return this.prisma.documento.findMany();
  }

  async findOne(id: number) {
    const documento = await this.prisma.documento.findUnique({
      where: { id },
    });

    if (!documento) {
      throw new NotFoundException(`Documento ID ${id} não encontrado`);
    }

    return documento;
  }

  async update(id: number, updateDocumentoDto: UpdateDocumentoDto) {
    // Verifica se o documento existe
    await this.findOne(id);

    return this.prisma.documento.update({
      where: { id },
      data: updateDocumentoDto,
    });
  }

  async remove(id: number) {
    // Verifica se o documento existe
    await this.findOne(id);

    return this.prisma.documento.delete({
      where: { id },
    });
  }

  async uploadFile(clienteId: number, file: Express.Multer.File, tipoDocumento: string) {
    try {
      // Busca o cliente para confirmar existência e obter o nome
      const cliente = await this.prisma.cliente.findUnique({
        where: { id: clienteId },
      });

      if (!cliente) {
        throw new NotFoundException(`Cliente ID ${clienteId} não encontrado`);
      }

      // Diretórios de base
      const baseDir = join(__dirname, '..', '..', '..', 'uploads');
      const docsDir = join(baseDir, 'documentos');

      // Criar o diretório do cliente se não existir
      const clienteFolderName = `${cliente.id}-${cliente.nome.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const clienteDir = join(docsDir, clienteFolderName);
      
      if (!existsSync(clienteDir)) {
        mkdirSync(clienteDir, { recursive: true });
      }

      // Caminho atual do arquivo temporário
      const tempFilePath = file.path;
      
      // Nome do arquivo original
      const fileName = basename(file.path);
      
      // Novo caminho no diretório do cliente
      const newFilePath = join(clienteDir, fileName);
      
      // Move o arquivo para o diretório do cliente
      renameSync(tempFilePath, newFilePath);

      // Atualiza o caminho do arquivo para o novo local
      const filePath = newFilePath;

      // Cria o registro do documento com o novo caminho
      return this.prisma.documento.create({
        data: {
          clienteId,
          tipo: tipoDocumento,
          nome: file.originalname,
          arquivo: filePath, // Caminho atualizado
          dataUpload: new Date(),
        },
      });
    } catch (error) {
      console.error('Erro ao processar upload de arquivo:', error);
      throw new Error(`Erro ao fazer upload: ${error.message}`);
    }
  }
}