// backend/src/modules/clientes/clientes.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { QueryClienteDto } from './dto/query-cliente.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto) {
    const { endereco, contatos, ...clienteData } = createClienteDto;

    try {
      // Verificar se já existe um cliente com o mesmo CPF/CNPJ
      const clienteExistente = await this.prisma.cliente.findUnique({
        where: { cpfCnpj: clienteData.cpfCnpj }
      });

      if (clienteExistente) {
        throw new ConflictException(`Cliente com CPF/CNPJ ${clienteData.cpfCnpj} já existe`);
      }

      // Converter a string de data para objeto Date, se existir
      const dataProcessada = {
        ...clienteData,
        dataNascimento: clienteData.dataNascimento 
          ? new Date(clienteData.dataNascimento) 
          : clienteData.dataNascimento
      };

      return this.prisma.cliente.create({
        data: {
          ...dataProcessada,
          endereco: endereco ? {
            create: endereco
          } : undefined,
          contatos: contatos ? {
            create: contatos
          } : undefined
        },
        include: {
          endereco: true,
          contatos: true
        }
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Erro de unicidade (código P2002)
        if (error.code === 'P2002') {
          throw new ConflictException(`Cliente com CPF/CNPJ ${clienteData.cpfCnpj} já existe`);
        }
      }
      throw error;
    }
  }

  async findAll(query: QueryClienteDto) {
    const filters = {};
    
    if (query.nome) {
      filters['nome'] = {
        contains: query.nome,
        mode: 'insensitive'
      };
    }

    if (query.cpfCnpj) {
      filters['cpfCnpj'] = {
        contains: query.cpfCnpj
      };
    }

    if (query.cidade || query.estado) {
      filters['endereco'] = {};

      if (query.cidade) {
        filters['endereco']['cidade'] = {
          contains: query.cidade,
          mode: 'insensitive'
        };
      }

      if (query.estado) {
        filters['endereco']['estado'] = query.estado;
      }
    }

    return this.prisma.cliente.findMany({
      where: filters,
      include: {
        endereco: true,
        contatos: true
      }
    });
  }

  async findOne(id: number) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: {
        endereco: true,
        contatos: true,
        documentos: true
      }
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente ID ${id} não encontrado`);
    }

    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    try {
      const { endereco, contatos, ...clienteData } = updateClienteDto;
      
      // Verificar se o cliente existe
      const clienteExistente = await this.findOne(id);
      
      // Verificar se o CPF/CNPJ foi alterado e se já existe outro cliente com esse CPF/CNPJ
      if (clienteData.cpfCnpj && clienteData.cpfCnpj !== clienteExistente.cpfCnpj) {
        const clienteComMesmoCpfCnpj = await this.prisma.cliente.findUnique({
          where: { cpfCnpj: clienteData.cpfCnpj }
        });
        
        if (clienteComMesmoCpfCnpj && clienteComMesmoCpfCnpj.id !== id) {
          throw new ConflictException(`Já existe um cliente com o CPF/CNPJ ${clienteData.cpfCnpj}`);
        }
      }

      // Converter a string de data para objeto Date, se existir
      const dataProcessada = {
        ...clienteData,
        dataNascimento: clienteData.dataNascimento 
          ? new Date(clienteData.dataNascimento) 
          : clienteData.dataNascimento
      };

      return this.prisma.cliente.update({
        where: { id },
        data: {
          ...dataProcessada,
          endereco: endereco ? {
            upsert: {
              create: endereco,
              update: endereco
            }
          } : undefined,
          contatos: contatos ? {
            upsert: {
              create: contatos,
              update: contatos
            }
          } : undefined
        },
        include: {
          endereco: true,
          contatos: true
        }
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Erro de unicidade (código P2002)
        if (error.code === 'P2002') {
          throw new ConflictException('Já existe um cliente com o CPF/CNPJ fornecido');
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    // Verificar se o cliente existe
    await this.findOne(id);

    return this.prisma.cliente.delete({
      where: { id }
    });
  }
}