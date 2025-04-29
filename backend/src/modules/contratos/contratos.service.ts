// backend/src/modules/contratos/contratos.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { QueryContratoDto } from './dto/query-contrato.dto';
import { ImportContratoDto } from './dto/import-contrato.dto';
import { AprovarContratoDto, NivelAprovacao } from './dto/aprovar-contrato.dto';
import { OficializarContratoDto } from './dto/oficializar-contrato.dto';

@Injectable()
export class ContratosService {
  constructor(private readonly prisma: PrismaService) {}

  async aprovarContrato(id: number, userId: number, aprovarContratoDto: AprovarContratoDto) {
    // Verificar se o contrato existe
    const contrato = await this.findOne(id);
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${id} não encontrado`);
    }
    
    // Verificar se o contrato está em estado apropriado para aprovação
    if (contrato.estado === 'oficializado') {
      throw new Error('Contrato já foi oficializado e não pode ser alterado');
    }
    
    // Verificar se o usuário tem permissão para aprovar neste nível
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new NotFoundException(`Usuário ID ${userId} não encontrado`);
    }
    
    // Verificar permissões por nível
    let updateData = {};
    
    switch (aprovarContratoDto.nivel) {
      case NivelAprovacao.VENDEDOR:
        if (user.perfil !== 'vendedor' && user.perfil !== 'loteadora') {
          throw new Error('Usuário não tem permissão para aprovar como vendedor');
        }
        if (contrato.vendedorId !== userId && user.perfil !== 'loteadora') {
          throw new Error('Apenas o vendedor responsável pelo contrato pode aprová-lo');
        }
        updateData = { 
          aprovadoVendedor: aprovarContratoDto.aprovado,
          estado: aprovarContratoDto.aprovado ? 'em_aprovacao' : 'pre_contrato'
        };
        break;
      
      case NivelAprovacao.DIRETOR:
        if (user.perfil !== 'loteadora') {
          throw new Error('Apenas diretores podem realizar essa aprovação');
        }
        updateData = { 
          aprovadoDiretor: aprovarContratoDto.aprovado,
          estado: aprovarContratoDto.aprovado && contrato.aprovadoVendedor ? 'em_aprovacao' : 'pre_contrato'
        };
        break;
      
      case NivelAprovacao.PROPRIETARIO:
        if (user.perfil !== 'dono_terreno' && user.perfil !== 'loteadora') {
          throw new Error('Usuário não tem permissão para aprovar como proprietário');
        }
        if (contrato.proprietarioId !== userId && user.perfil !== 'loteadora') {
          throw new Error('Apenas o proprietário do loteamento pode aprová-lo');
        }
        updateData = { 
          aprovadoProprietario: aprovarContratoDto.aprovado,
          estado: aprovarContratoDto.aprovado && contrato.aprovadoVendedor && contrato.aprovadoDiretor ? 'aprovado' : 'em_aprovacao'
        };
        break;
      
      default:
        throw new Error('Nível de aprovação inválido');
    }
    
    // Registrar a aprovação
    const contratoAtualizado = await this.prisma.contrato.update({
      where: { id },
      data: updateData,
      include: {
        cliente: true,
        lote: true,
        vendedor: true,
        proprietario: true
      }
    });
    
    // Se todas as aprovações foram concluídas, atualizar o estado para 'aprovado'
    if (contratoAtualizado.aprovadoVendedor && 
        contratoAtualizado.aprovadoDiretor && 
        contratoAtualizado.aprovadoProprietario) {
      await this.prisma.contrato.update({
        where: { id },
        data: { estado: 'aprovado' }
      });
    }
    
    return contratoAtualizado;
  }

  async oficializarContrato(id: number, userId: number, oficializarContratoDto: OficializarContratoDto) {
    // Verificar se o contrato existe
    const contrato = await this.findOne(id);
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${id} não encontrado`);
    }
    
    // Verificar se o contrato está aprovado
    if (contrato.estado !== 'aprovado') {
      throw new Error('Contrato deve estar aprovado para ser oficializado');
    }
    
    // Verificar se o usuário tem permissão (apenas loteadora ou diretor)
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user || user.perfil !== 'loteadora') {
      throw new Error('Apenas administradores podem oficializar contratos');
    }
    
    // Atualizar o contrato para oficializado
    const contratoOficializado = await this.prisma.contrato.update({
      where: { id },
      data: {
        estado: 'oficializado',
        contratoOficialUrl: oficializarContratoDto.contratoOficialUrl,
        dataOficializacao: new Date()
      },
      include: {
        cliente: true,
        lote: true,
        vendedor: true,
        proprietario: true
      }
    });
    
    // Atualizar o status do lote para "vendido"
    await this.prisma.lote.update({
      where: { id: contrato.loteId },
      data: { status: 'vendido' }
    });
    
    return contratoOficializado;
  }

  async getContratosByVendedor(vendedorId: number) {
    return this.prisma.contrato.findMany({
      where: { vendedorId },
      include: {
        cliente: true,
        lote: true
      }
    });
  }

  async getContratosByProprietario(proprietarioId: number) {
    // Buscar lotes do proprietário
    const loteamentos = await this.prisma.loteamento.findMany({
      where: { proprietarioId },
      include: { lotes: true }
    });
    
    const lotesIds = loteamentos.flatMap(loteamento => 
      loteamento.lotes.map(lote => lote.id)
    );
    
    // Buscar contratos vinculados a esses lotes
    return this.prisma.contrato.findMany({
      where: { 
        loteId: { in: lotesIds }
      },
      include: {
        cliente: true,
        lote: true
      }
    });
  }

  async importContratos(importContratosDto: ImportContratoDto[]) {
    const results = [];
    
    for (const contratoDto of importContratosDto) {
      try {
        // Buscar o lote pela chave
        const lote = await this.prisma.lote.findFirst({
          where: { chave: contratoDto.chave }
        });
        
        if (!lote) {
          results.push({ 
            status: 'error', 
            chave: contratoDto.chave, 
            error: 'Lote não encontrado' 
          });
          continue;
        }
        
        // Verificar se o contrato já existe pelo número do contrato
        const existingContrato = await this.prisma.contrato.findFirst({
          where: { numeroContrato: contratoDto.numeroContrato }
        });
        
        // Preparar os dados do contrato
        const contratoData = {
          clienteId: contratoDto.idCliente,
          loteId: lote.id,
          chave: contratoDto.chave,
          numeroContrato: contratoDto.numeroContrato,
          dataEmissao: new Date(contratoDto.dataEmissao),
          valorTotal: contratoDto.valorContrato,
          numeroParcelas: contratoDto.numeroParcelas,
          dataPrimeiraPrestacao: new Date(contratoDto.dataPrimeiraPrestacao),
          valorPrestacao: contratoDto.valorPrestacao,
          // Campos obrigatórios - valores padrão
          dataInicio: new Date(contratoDto.dataPrimeiraPrestacao),
          dataFim: new Date(new Date(contratoDto.dataPrimeiraPrestacao).setMonth(new Date(contratoDto.dataPrimeiraPrestacao).getMonth() + contratoDto.numeroParcelas)),
          valorEntrada: 0, // Valor padrão
          dataVencimento: new Date(contratoDto.dataPrimeiraPrestacao).getDate(),
          clausulas: 'Importado automaticamente' // Valor padrão
        };
        
        if (existingContrato) {
          // Atualizar o contrato existente
          const updatedContrato = await this.prisma.contrato.update({
            where: { id: existingContrato.id },
            data: contratoData
          });
          results.push({ status: 'updated', contrato: updatedContrato });
        } else {
          // Criar novo contrato
          const newContrato = await this.prisma.contrato.create({
            data: contratoData
          });
          results.push({ status: 'created', contrato: newContrato });
        }
      } catch (error) {
        results.push({ 
          status: 'error', 
          numeroContrato: contratoDto.numeroContrato, 
          error: error.message 
        });
      }
    }
    
    return {
      total: importContratosDto.length,
      processed: results.length,
      results
    };
  }

  async getByLoteId(loteId: number) {
    // Verificando se o lote existe
    const lote = await this.prisma.lote.findUnique({
      where: { id: loteId }
    });
    
    if (!lote) {
      throw new NotFoundException(`Lote ID ${loteId} não encontrado`);
    }
    
    return this.prisma.contrato.findMany({
      where: { loteId },
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

  async create(createContratoDto: CreateContratoDto) {
    // Verificando se o cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: createContratoDto.clienteId }
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente ID ${createContratoDto.clienteId} não encontrado`);
    }
    
    // Verificando se o lote existe e está disponível
    const lote = await this.prisma.lote.findUnique({
      where: { id: createContratoDto.loteId }
    });
    
    if (!lote) {
      throw new NotFoundException(`Lote ID ${createContratoDto.loteId} não encontrado`);
    }
    
    if (lote.status !== 'disponivel') {
      throw new Error(`Lote ID ${createContratoDto.loteId} não está disponível`);
    }
    
    // Criando o contrato com estado inicial "pre_contrato"
    const contrato = await this.prisma.contrato.create({
      data: {
        ...createContratoDto,
        dataCriacao: new Date(),
        estado: 'pre_contrato',
        aprovadoVendedor: false,
        aprovadoDiretor: false,
        aprovadoProprietario: false
      }
    });
    
    // Atualizando o status do lote para reservado
    await this.prisma.lote.update({
      where: { id: createContratoDto.loteId },
      data: { status: 'reservado' }
    });
    
    return contrato;
  }

  async findAll(query: QueryContratoDto) {
    const filters = {};
    
    if (query.clienteId) {
      filters['clienteId'] = query.clienteId;
    }
    
    if (query.loteId) {
      filters['loteId'] = query.loteId;
    }
    
    if (query.status) {
      filters['status'] = query.status;
    }
    
    if (query.dataInicio) {
      filters['dataInicio'] = {
        gte: new Date(query.dataInicio)
      };
    }
    
    if (query.dataFim) {
      filters['dataFim'] = {
        lte: new Date(query.dataFim)
      };
    }
    
    return this.prisma.contrato.findMany({
      where: filters,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            cpfCnpj: true
          }
        },
        lote: true,
        vendedor: {
          select: {
            id: true,
            name: true
          }
        },
        proprietario: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  async findOne(id: number) {
    const contrato = await this.prisma.contrato.findUnique({
      where: { id },
      include: {
        cliente: {
          include: {
            endereco: true,
            contatos: true
          }
        },
        lote: true,
        boletos: true,
        reajustes: true,
        vendedor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        proprietario: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${id} não encontrado`);
    }
    
    return contrato;
  }

  async update(id: number, updateContratoDto: UpdateContratoDto) {
    // Verificando se o contrato existe
    const contrato = await this.findOne(id);
    
    // Verificar se o contrato pode ser editado
    if (contrato.estado === 'oficializado') {
      throw new Error('Contrato já foi oficializado e não pode ser alterado diretamente. Utilize aditivos contratuais para alterações.');
    }
    
    // Se estiver atualizando o loteId, precisa verificar disponibilidade
    if (updateContratoDto.loteId) {
      const loteAtual = await this.prisma.contrato.findUnique({
        where: { id },
        select: { loteId: true }
      });
      
      if (loteAtual && loteAtual.loteId !== updateContratoDto.loteId) {
        // Verificando se o novo lote existe e está disponível
        const novoLote = await this.prisma.lote.findUnique({
          where: { id: updateContratoDto.loteId }
        });
        
        if (!novoLote) {
          throw new NotFoundException(`Lote ID ${updateContratoDto.loteId} não encontrado`);
        }
        
        if (novoLote.status !== 'disponivel') {
          throw new Error(`Lote ID ${updateContratoDto.loteId} não está disponível`);
        }
        
        // Liberando o lote antigo
        await this.prisma.lote.update({
          where: { id: loteAtual.loteId },
          data: { status: 'disponivel' }
        });
        
        // Reservando o novo lote
        await this.prisma.lote.update({
          where: { id: updateContratoDto.loteId },
          data: { status: 'reservado' }
        });
      }
    }
    
    // Atualizando o contrato
    return this.prisma.contrato.update({
      where: { id },
      data: updateContratoDto,
      include: {
        cliente: true,
        lote: true
      }
    });
  }

  async remove(id: number) {
    // Verificando se o contrato existe
    const contrato = await this.findOne(id);
    
    // Verificar se o contrato pode ser removido
    if (contrato.estado === 'oficializado') {
      throw new Error('Contrato já foi oficializado e não pode ser removido. Utilize distratos para cancelar o contrato.');
    }
    
    // Liberando o lote
    await this.prisma.lote.update({
      where: { id: contrato.loteId },
      data: { status: 'disponivel' }
    });
    
    // Removendo o contrato
    return this.prisma.contrato.delete({
      where: { id }
    });
  }

  async getByClienteId(clienteId: number) {
    return this.prisma.contrato.findMany({
      where: { clienteId },
      include: {
        lote: true
      }
    });
  }

  async getLotesDisponiveis() {
    return this.prisma.lote.findMany({
      where: { status: 'disponivel' }
    });
  }

  async gerarPrevia(contratoDto: CreateContratoDto) {
    // Busca detalhes do cliente
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: contratoDto.clienteId }
    });
    
    // Busca detalhes do lote
    const lote = await this.prisma.lote.findUnique({
      where: { id: contratoDto.loteId }
    });
    
    if (!cliente || !lote) {
      throw new NotFoundException('Cliente ou lote não encontrado');
    }
    
    // Calcula valor da parcela
    const valorParcela = (contratoDto.valorTotal - contratoDto.valorEntrada) / contratoDto.numeroParcelas;
    
    // Gera o texto do contrato (simplificado)
    const textoContrato = `
CONTRATO DE COMPRA E VENDA DE IMÓVEL

VENDEDOR: Sistema de Gestão de Loteamentos LTDA
COMPRADOR: ${cliente.nome}, CPF/CNPJ: ${cliente.cpfCnpj}

OBJETO:
Lote n° ${lote.numero}, Quadra ${lote.quadra}, do Loteamento ${lote.loteamento},
com área de ${lote.area} m².

VALOR:
R$ ${contratoDto.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Entrada: R$ ${contratoDto.valorEntrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Saldo em ${contratoDto.numeroParcelas} parcelas mensais de R$ ${valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

PRAZO:
Início: ${new Date(contratoDto.dataInicio).toLocaleDateString('pt-BR')}
Fim: ${new Date(contratoDto.dataFim).toLocaleDateString('pt-BR')}
Vencimento: Dia ${contratoDto.dataVencimento} de cada mês

CLÁUSULAS ESPECIAIS:
${contratoDto.clausulas}

[Local e data]

____________________
VENDEDOR

____________________
COMPRADOR
    `;
    
    return textoContrato;
  }
}