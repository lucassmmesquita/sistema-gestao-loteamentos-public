// backend/src/modules/parcelas/parcelas.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateParcelaDto } from './dto/create-parcela.dto';
import { UpdateParcelaDto } from './dto/update-parcela.dto';
import { PagamentoParcelaDto } from './dto/pagamento-parcela.dto';
import { addMonths } from 'date-fns';

@Injectable()
export class ParcelasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createParcelaDto: CreateParcelaDto) {
    // Verificando se o contrato existe
    const contrato = await this.prisma.contrato.findUnique({
      where: { id: createParcelaDto.contratoId }
    });
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${createParcelaDto.contratoId} não encontrado`);
    }
    
    // Criando a parcela
    return this.prisma.parcela.create({
      data: {
        ...createParcelaDto,
        status: createParcelaDto.status || 'futura'
      }
    });
  }

  async findAll() {
    return this.prisma.parcela.findMany({
      orderBy: [
        { contratoId: 'asc' },
        { numero: 'asc' }
      ]
    });
  }

  async findOne(id: number) {
    const parcela = await this.prisma.parcela.findUnique({
      where: { id },
      include: {
        contrato: true,
        boleto: true
      }
    });
    
    if (!parcela) {
      throw new NotFoundException(`Parcela ID ${id} não encontrada`);
    }
    
    return parcela;
  }

  async findByContrato(contratoId: number) {
    // Verificando se o contrato existe
    const contrato = await this.prisma.contrato.findUnique({
      where: { id: contratoId }
    });
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${contratoId} não encontrado`);
    }
    
    // Buscando parcelas do contrato
    return this.prisma.parcela.findMany({
      where: { contratoId },
      orderBy: { numero: 'asc' },
      include: {
        boleto: {
          select: {
            id: true,
            nossoNumero: true,
            status: true,
            pdfUrl: true
          }
        }
      }
    });
  }

  async gerarParcelas(contratoId: number) {
    // Verificando se o contrato existe
    const contrato = await this.prisma.contrato.findUnique({
      where: { id: contratoId }
    });
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${contratoId} não encontrado`);
    }
    
    // Verificando se já existem parcelas para o contrato
    const parcelasExistentes = await this.prisma.parcela.findMany({
      where: { contratoId }
    });
    
    if (parcelasExistentes.length > 0) {
      throw new Error('Já existem parcelas geradas para este contrato');
    }
    
    // Calculando valor da parcela - Corrigido para tratar como números
    const valorTotal = Number(contrato.valorTotal);
    const valorEntrada = Number(contrato.valorEntrada);
    const valorFinanciado = valorTotal - valorEntrada;
    const valorParcela = valorFinanciado / contrato.numeroParcelas;
    
    // Determinar a data base para vencimento das parcelas
    let dataBase: Date;
    
    if (contrato.dataPrimeiraPrestacao) {
      dataBase = new Date(contrato.dataPrimeiraPrestacao);
    } else {
      // Se não houver data específica, use a data atual e ajuste o dia para o dia de vencimento
      dataBase = new Date();
      dataBase.setDate(contrato.dataVencimento);
      
      // Se o dia atual for maior que o dia de vencimento, avança para o próximo mês
      if (dataBase.getDate() > contrato.dataVencimento) {
        dataBase = addMonths(dataBase, 1);
      }
    }
    
    // Criando as parcelas
    const parcelas = [];
    
    for (let i = 1; i <= contrato.numeroParcelas; i++) {
      // Calcula a data de vencimento desta parcela
      const dataVencimento = new Date(dataBase);
      if (i > 1) {
        dataVencimento.setMonth(dataBase.getMonth() + (i - 1));
      }
      
      // Define o status com base na data de vencimento
      let status = 'futura';
      const hoje = new Date();
      
      if (dataVencimento < hoje) {
        status = 'atrasada';
      } else if (Math.floor((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)) <= 7) {
        status = 'vencendo';
      }
      
      // Cria a parcela
      const parcela = await this.prisma.parcela.create({
        data: {
          contratoId,
          numero: i,
          valor: valorParcela,
          dataVencimento,
          status
        }
      });
      
      parcelas.push(parcela);
    }
    
    return parcelas;
  }

  async update(id: number, updateParcelaDto: UpdateParcelaDto) {
    // Verificando se a parcela existe
    await this.findOne(id);
    
    // Atualizando a parcela
    return this.prisma.parcela.update({
      where: { id },
      data: updateParcelaDto
    });
  }

  async registrarPagamento(id: number, pagamentoDto: PagamentoParcelaDto) {
    // Verificando se a parcela existe
    const parcela = await this.findOne(id);
    
    if (parcela.dataPagamento) {
      throw new Error('Esta parcela já está paga');
    }
    
    // Registrando o pagamento
    const parcelaPaga = await this.prisma.parcela.update({
      where: { id },
      data: {
        status: 'paga',
        dataPagamento: pagamentoDto.dataPagamento,
        valorPago: pagamentoDto.valorPago,
        formaPagamento: pagamentoDto.formaPagamento,
        observacoes: pagamentoDto.observacoes
      },
      include: {
        contrato: true,
        boleto: true
      }
    });
    
    // Atualiza o número de parcelas pagas no contrato
    await this.prisma.contrato.update({
      where: { id: parcela.contratoId },
      data: {
        parcelasPagas: {
          increment: 1
        }
      }
    });
    
    // Se a parcela tiver um boleto associado, atualiza o status dele também
    if (parcela.boletoId) {
      await this.prisma.boleto.update({
        where: { id: parcela.boletoId },
        data: {
          status: 'pago',
          dataPagamento: pagamentoDto.dataPagamento,
          valorPago: pagamentoDto.valorPago,
          formaPagamento: pagamentoDto.formaPagamento
        }
      });
    }
    
    return parcelaPaga;
  }

  async remove(id: number) {
    // Verificando se a parcela existe
    await this.findOne(id);
    
    // Removendo a parcela
    return this.prisma.parcela.delete({
      where: { id }
    });
  }
}