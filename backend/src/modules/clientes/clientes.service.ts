// backend/src/modules/clientes/clientes.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { QueryClienteDto } from './dto/query-cliente.dto';
import { ImportClienteDto } from './dto/import-cliente.dto';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async importClientes(importClientesDto: ImportClienteDto[]) {
    const results = [];
    
    for (const clienteDto of importClientesDto) {
      try {
        // Verificar se o cliente já existe pelo ID
        const existingCliente = await this.prisma.cliente.findUnique({
          where: { id: clienteDto.idCliente }
        });
        
        // Preparar os dados do cliente
        const clienteData = {
          nome: clienteDto.nomeComprador,
          nomeConjuge: clienteDto.nomeConjuge,
          profissao: clienteDto.profissao,
          dataNascimento: clienteDto.dataNascimento ? new Date(clienteDto.dataNascimento) : null,
          // Campo obrigatório
          cpfCnpj: existingCliente?.cpfCnpj || `IMPORTADO-${clienteDto.idCliente}` 
        };
        
        // Preparar dados de endereço se disponíveis
        const enderecoData = clienteDto.bairro || clienteDto.estado || clienteDto.cep || clienteDto.enderecoCliente
          ? {
              bairro: clienteDto.bairro || '',
              estado: clienteDto.estado || '',
              cep: clienteDto.cep || '',
              logradouro: clienteDto.enderecoCliente || '',
              numero: '', // Obrigatório mas não temos na importação
              cidade: '' // Obrigatório mas não temos na importação
            }
          : null;
        
        if (existingCliente) {
          // Atualizar o cliente existente
          const updatedCliente = await this.prisma.cliente.update({
            where: { id: existingCliente.id },
            data: {
              ...clienteData,
              endereco: enderecoData
                ? {
                    upsert: {
                      create: enderecoData,
                      update: enderecoData
                    }
                  }
                : undefined
            },
            include: {
              endereco: true
            }
          });
          results.push({ status: 'updated', cliente: updatedCliente });
        } else {
          // Criar novo cliente
          const newCliente = await this.prisma.cliente.create({
            data: {
              ...clienteData,
              id: clienteDto.idCliente, // Definir ID específico
              endereco: enderecoData 
                ? {
                    create: enderecoData
                  } 
                : undefined
            },
            include: {
              endereco: true
            }
          });
          results.push({ status: 'created', cliente: newCliente });
        }
      } catch (error) {
        results.push({ 
          status: 'error', 
          idCliente: clienteDto.idCliente, 
          error: error.message 
        });
      }
    }
    
    return {
      total: importClientesDto.length,
      processed: results.length,
      results
    };
  }

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
      if (error instanceof PrismaClientKnownRequestError) {
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
  
    const clientes = await this.prisma.cliente.findMany({
      where: filters,
      include: {
        endereco: true,
        contatos: true,
        // Incluir os contratos e documentos para contagem
        contratos: {
          select: {
            id: true  // Apenas o ID é suficiente para contagem
          }
        },
        documentos: {
          select: {
            id: true // Apenas o ID é suficiente para contagem
          }
        }
      }
    });
    
    // Mapear para incluir contagem de contratos e documentos
    return clientes.map(cliente => {
      const { contratos, documentos, ...clienteData } = cliente;
      return {
        ...clienteData,
        contratosCount: contratos.length, // Adicionar contagem de contratos
        documentosCount: documentos.length // Adicionar contagem de documentos
        // Não enviamos as listas completas para economizar largura de banda
      };
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
      if (error instanceof PrismaClientKnownRequestError) {
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