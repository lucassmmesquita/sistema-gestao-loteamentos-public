import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { QueryClienteDto } from './dto/query-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto) {
    const { endereco, contatos, ...clienteData } = createClienteDto;

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
    const { endereco, contatos, ...clienteData } = updateClienteDto;
    
    // Verificar se o cliente existe
    await this.findOne(id);

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
  }

  async remove(id: number) {
    // Verificar se o cliente existe
    await this.findOne(id);

    return this.prisma.cliente.delete({
      where: { id }
    });
  }
}