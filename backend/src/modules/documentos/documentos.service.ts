import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAditivoDto } from './dto/create-aditivo.dto';
import { UpdateAditivoDto } from './dto/update-aditivo.dto';
import { CreateDistratoDto } from './dto/create-distrato.dto';
import { UpdateDistratoDto } from './dto/update-distrato.dto';
import { CreateQuitacaoDto } from './dto/create-quitacao.dto';
import { UpdateQuitacaoDto } from './dto/update-quitacao.dto';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@Injectable()
export class DocumentosService {
  constructor(private readonly prisma: PrismaService) {}

  // ADITIVOS
  async createAditivo(createAditivoDto: CreateAditivoDto) {
    // Verificando se o contrato existe
    const contrato = await this.prisma.contrato.findUnique({
      where: { id: createAditivoDto.contratoId }
    });
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${createAditivoDto.contratoId} não encontrado`);
    }
    
    // Criando o aditivo
    return this.prisma.aditivo.create({
      data: createAditivoDto
    });
  }

  async findAllAditivos(contratoId: number = null) {
    const where = contratoId ? { contratoId } : {};
    
    return this.prisma.aditivo.findMany({
      where,
      include: {
        contrato: {
          select: {
            id: true,
            clienteId: true,
            cliente: {
              select: {
                id: true,
                nome: true,
                cpfCnpj: true
              }
            }
          }
        }
      }
    });
  }

  async findOneAditivo(id: number) {
    const aditivo = await this.prisma.aditivo.findUnique({
      where: { id },
      include: {
        contrato: {
          include: {
            cliente: {
              select: {
                id: true,
                nome: true,
                cpfCnpj: true
              }
            }
          }
        }
      }
    });
    
    if (!aditivo) {
      throw new NotFoundException(`Aditivo ID ${id} não encontrado`);
    }
    
    return aditivo;
  }

  async updateAditivo(id: number, updateAditivoDto: UpdateAditivoDto) {
    // Verificando se o aditivo existe
    await this.findOneAditivo(id);
    
    return this.prisma.aditivo.update({
      where: { id },
      data: updateAditivoDto
    });
  }

  async removeAditivo(id: number) {
    // Verificando se o aditivo existe
    await this.findOneAditivo(id);
    
    return this.prisma.aditivo.delete({
      where: { id }
    });
  }

  // DISTRATOS
  async createDistrato(createDistratoDto: CreateDistratoDto) {
    // Verificando se o contrato existe
    const contrato = await this.prisma.contrato.findUnique({
      where: { id: createDistratoDto.contratoId }
    });
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${createDistratoDto.contratoId} não encontrado`);
    }
    
    // Criando o distrato
    return this.prisma.distrato.create({
      data: createDistratoDto
    });
  }

  async findAllDistratos(contratoId: number = null) {
    const where = contratoId ? { contratoId } : {};
    
    return this.prisma.distrato.findMany({
      where,
      include: {
        contrato: {
          select: {
            id: true,
            clienteId: true,
            cliente: {
              select: {
                id: true,
                nome: true,
                cpfCnpj: true
              }
            }
          }
        }
      }
    });
  }

  async findOneDistrato(id: number) {
    const distrato = await this.prisma.distrato.findUnique({
      where: { id },
      include: {
        contrato: {
          include: {
            cliente: {
              select: {
                id: true,
                nome: true,
                cpfCnpj: true
              }
            }
          }
        }
      }
    });
    
    if (!distrato) {
      throw new NotFoundException(`Distrato ID ${id} não encontrado`);
    }
    
    return distrato;
  }

  async updateDistrato(id: number, updateDistratoDto: UpdateDistratoDto) {
    // Verificando se o distrato existe
    await this.findOneDistrato(id);
    
    return this.prisma.distrato.update({
      where: { id },
      data: updateDistratoDto
    });
  }

  async removeDistrato(id: number) {
    // Verificando se o distrato existe
    await this.findOneDistrato(id);
    
    return this.prisma.distrato.delete({
      where: { id }
    });
  }

  // QUITAÇÕES
  async createQuitacao(createQuitacaoDto: CreateQuitacaoDto) {
    // Verificando se o contrato existe
    const contrato = await this.prisma.contrato.findUnique({
      where: { id: createQuitacaoDto.contratoId }
    });
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${createQuitacaoDto.contratoId} não encontrado`);
    }
    
    // Verificando se já existe quitação para este contrato
    const quitacaoExistente = await this.prisma.quitacao.findFirst({
      where: { contratoId: createQuitacaoDto.contratoId }
    });
    
    if (quitacaoExistente) {
      throw new Error(`Já existe uma quitação para o contrato ID ${createQuitacaoDto.contratoId}`);
    }
    
    // Criando a quitação
    const quitacao = await this.prisma.quitacao.create({
      data: createQuitacaoDto
    });
    
    // Atualizando o status do contrato para quitado
    await this.prisma.contrato.update({
      where: { id: createQuitacaoDto.contratoId },
      data: { status: 'quitado' }
    });
    
    return quitacao;
  }

  async findAllQuitacoes(contratoId: number = null) {
    const where = contratoId ? { contratoId } : {};
    
    return this.prisma.quitacao.findMany({
      where,
      include: {
        contrato: {
          select: {
            id: true,
            clienteId: true,
            cliente: {
              select: {
                id: true,
                nome: true,
                cpfCnpj: true
              }
            }
          }
        }
      }
    });
  }

  async findOneQuitacao(id: number) {
    const quitacao = await this.prisma.quitacao.findUnique({
      where: { id },
      include: {
        contrato: {
          include: {
            cliente: {
              select: {
                id: true,
                nome: true,
                cpfCnpj: true
              }
            }
          }
        }
      }
    });
    
    if (!quitacao) {
      throw new NotFoundException(`Quitação ID ${id} não encontrada`);
    }
    
    return quitacao;
  }

  async updateQuitacao(id: number, updateQuitacaoDto: UpdateQuitacaoDto) {
    // Verificando se a quitação existe
    await this.findOneQuitacao(id);
    
    return this.prisma.quitacao.update({
      where: { id },
      data: updateQuitacaoDto
    });
  }

  async removeQuitacao(id: number) {
    // Verificando se a quitação existe
    const quitacao = await this.findOneQuitacao(id);
    
    // Atualizando o status do contrato para ativo
    await this.prisma.contrato.update({
      where: { id: quitacao.contratoId },
      data: { status: 'ativo' }
    });
    
    return this.prisma.quitacao.delete({
      where: { id }
    });
  }

  // DOCUMENTOS GERAIS
  async createDocumento(createDocumentoDto: CreateDocumentoDto) {
    // Verificando se o contrato existe
    const contrato = await this.prisma.contrato.findUnique({
      where: { id: createDocumentoDto.contratoId }
    });
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${createDocumentoDto.contratoId} não encontrado`);
    }
    
    // Removido o contratoId do objeto data, já que não existe no modelo
    return this.prisma.documento.create({
      data: {
        clienteId: contrato.clienteId,
        tipo: createDocumentoDto.tipo,
        nome: createDocumentoDto.nome,
        arquivo: createDocumentoDto.arquivo
      }
    });
  }

  async uploadDocumento(contratoId: number, tipo: string, file: any) {
    // Verificando se o contrato existe
    const contrato = await this.prisma.contrato.findUnique({
      where: { id: contratoId }
    });
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${contratoId} não encontrado`);
    }
    
    // Simulando a URL do arquivo
    const arquivo = `uploads/${new Date().getTime()}_${file.originalname}`;
    
    // Criando o documento no banco sem contratoId
    return this.prisma.documento.create({
      data: {
        clienteId: contrato.clienteId,
        tipo,
        nome: file.originalname,
        arquivo
      }
    });
  }

  async findAllDocumentos(contratoId: number = null) {
    // Como contratoId não existe no modelo, vamos filtrar por clientId do contrato
    let where = {};
    
    if (contratoId) {
      const contrato = await this.prisma.contrato.findUnique({
        where: { id: contratoId }
      });
      
      if (contrato) {
        where = { clienteId: contrato.clienteId };
      }
    }
    
    return this.prisma.documento.findMany({
      where,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            cpfCnpj: true
          }
        }
      }
    });
  }

  async findOneDocumento(id: number) {
    const documento = await this.prisma.documento.findUnique({
      where: { id },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            cpfCnpj: true
          }
        }
      }
    });
    
    if (!documento) {
      throw new NotFoundException(`Documento ID ${id} não encontrado`);
    }
    
    return documento;
  }

  async updateDocumento(id: number, updateDocumentoDto: UpdateDocumentoDto) {
    // Verificando se o documento existe
    await this.findOneDocumento(id);
    
    return this.prisma.documento.update({
      where: { id },
      data: updateDocumentoDto
    });
  }

  async removeDocumento(id: number) {
    // Verificando se o documento existe
    await this.findOneDocumento(id);
    
    // Em um ambiente real, aqui você removeria o arquivo do storage
    
    return this.prisma.documento.delete({
      where: { id }
    });
  }
}