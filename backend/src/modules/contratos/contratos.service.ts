import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { QueryContratoDto } from './dto/query-contrato.dto';

@Injectable()
export class ContratosService {
  constructor(private readonly prisma: PrismaService) {}

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
    
    // Criando o contrato
    const contrato = await this.prisma.contrato.create({
      data: {
        ...createContratoDto,
        dataCriacao: new Date()
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
        lote: true
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
        reajustes: true
      }
    });
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${id} não encontrado`);
    }
    
    return contrato;
  }

  async update(id: number, updateContratoDto: UpdateContratoDto) {
    // Verificando se o contrato existe
    await this.findOne(id);
    
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