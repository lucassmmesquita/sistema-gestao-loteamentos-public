// backend/src/modules/documentos/documentos.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    clienteId: number;
    tipo: string;
    nome: string;
    arquivo: string;
  }) {
    // Verificar se o cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: data.clienteId },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${data.clienteId} não encontrado`);
    }

    console.log('Criando documento:', data);

    return this.prisma.documento.create({
      data: {
        clienteId: data.clienteId,
        tipo: data.tipo,
        nome: data.nome,
        arquivo: data.arquivo,
      },
    });
  }

  async findAll(clienteId?: number) {
    const where = clienteId ? { clienteId } : {};
    
    return this.prisma.documento.findMany({
      where,
      orderBy: { dataUpload: 'desc' },
    });
  }

  async findOne(id: number) {
    const documento = await this.prisma.documento.findUnique({
      where: { id },
    });

    if (!documento) {
      throw new NotFoundException(`Documento com ID ${id} não encontrado`);
    }

    return documento;
  }

  async remove(id: number) {
    // Verificar se o documento existe
    const documento = await this.findOne(id);

    // Remove o arquivo físico
    try {
      const filePath = path.join(process.cwd(), documento.arquivo.replace(/^\/uploads/, 'uploads'));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error);
    }

    return this.prisma.documento.delete({
      where: { id },
    });
  }
}