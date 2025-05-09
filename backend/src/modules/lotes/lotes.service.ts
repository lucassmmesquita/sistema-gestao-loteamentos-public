import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { QueryLoteDto } from './dto/query-lote.dto';
import { ImportLoteDto } from './dto/import-lote.dto';

@Injectable()
export class LotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLoteDto: CreateLoteDto) {
    return this.prisma.lote.create({
      data: createLoteDto
    });
  }
  async importLotes(importLotesDto: ImportLoteDto[]) {
    const results = [];
    
    for (const loteDto of importLotesDto) {
      try {
        // Verificar se o lote já existe pela chave
        const existingLote = await this.prisma.lote.findFirst({
          where: { 
            chave: loteDto.chave 
          }
        });
        
        if (existingLote) {
          // Atualizar o lote existente
          const updatedLote = await this.prisma.lote.update({
            where: { id: existingLote.id },
            data: {
              numero: String(loteDto.lote),
              quadra: String(loteDto.quadra),
              area: loteDto.area,
              chave: loteDto.chave
            }
          });
          results.push({ status: 'updated', lote: updatedLote });
        } else {
          // Criar novo lote
          const newLote = await this.prisma.lote.create({
            data: {
              numero: String(loteDto.lote),
              quadra: String(loteDto.quadra),
              area: loteDto.area,
              chave: loteDto.chave,
              loteamento: 'Importado', // Valor padrão
              valorBase: 0, // Valor padrão
              status: 'disponivel'
            }
          });
          results.push({ status: 'created', lote: newLote });
        }
      } catch (error) {
        results.push({ status: 'error', chave: loteDto.chave, error: error.message });
      }
    }
    
    return {
      total: importLotesDto.length,
      processed: results.length,
      results
    };
  }

  async findAll(query: QueryLoteDto) {
    const filters = {};
    
    // Aplicando filtros
    if (query.status) {
      filters['status'] = query.status;
    }
    
    if (query.quadra) {
      filters['quadra'] = query.quadra;
    }
    
    if (query.numero) {
      filters['numero'] = {
        contains: query.numero,
        mode: 'insensitive'
      };
    }
    
    if (query.loteamento) {
      filters['loteamento'] = {
        contains: query.loteamento,
        mode: 'insensitive'
      };
    }
    
    // Filtros de área
    if (query.areaMinima || query.areaMaxima) {
      filters['area'] = {};
      
      if (query.areaMinima) {
        filters['area']['gte'] = query.areaMinima;
      }
      
      if (query.areaMaxima) {
        filters['area']['lte'] = query.areaMaxima;
      }
    }
    
    // Filtros de valor
    if (query.valorMinimo || query.valorMaximo) {
      filters['valorBase'] = {};
      
      if (query.valorMinimo) {
        filters['valorBase']['gte'] = query.valorMinimo;
      }
      
      if (query.valorMaximo) {
        filters['valorBase']['lte'] = query.valorMaximo;
      }
    }
    
    return this.prisma.lote.findMany({
      where: filters
    });
  }

  async findOne(id: number) {
    const lote = await this.prisma.lote.findUnique({
      where: { id },
      include: {
        contratos: {
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
    
    if (!lote) {
      throw new NotFoundException(`Lote ID ${id} não encontrado`);
    }
    
    return lote;
  }

  async update(id: number, updateLoteDto: UpdateLoteDto) {
    // Verificando se o lote existe
    await this.findOne(id);
    
    return this.prisma.lote.update({
      where: { id },
      data: updateLoteDto
    });
  }

  async remove(id: number) {
    // Verificando se o lote existe
    const lote = await this.findOne(id);
    
    // Verificando se o lote está vinculado a algum contrato
    if (lote.contratos.length > 0) {
      throw new Error(`Não é possível excluir o lote, pois ele está vinculado a contratos`);
    }
    
    return this.prisma.lote.delete({
      where: { id }
    });
  }

  async getLotesDisponiveis() {
    return this.prisma.lote.findMany({
      where: { status: 'disponivel' }
    });
  }

  async getLotesByQuadra(quadra: string) {
    return this.prisma.lote.findMany({
      where: { quadra }
    });
  }

  async getLotesByLoteamento(loteamento: string) {
    return this.prisma.lote.findMany({
      where: {
        loteamento: {
          contains: loteamento,
          mode: 'insensitive'
        }
      }
    });
  }
}