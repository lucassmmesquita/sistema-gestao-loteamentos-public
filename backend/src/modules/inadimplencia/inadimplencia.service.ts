// backend/src/modules/inadimplencia/inadimplencia.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryInadimplenciaDto } from './dto/query-inadimplencia.dto';
import { RegistrarInteracaoDto } from './dto/registrar-interacao.dto';
import { EnviarComunicacaoDto } from './dto/enviar-comunicacao.dto';
import { GerarBoletoDto } from './dto/gerar-boleto.dto';
import { SalvarGatilhosDto } from './dto/salvar-gatilhos.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InadimplenciaService {
  constructor(private readonly prisma: PrismaService) {}

  async listarClientesInadimplentes(query: QueryInadimplenciaDto) {
    // Construir o filtro com base nos parâmetros da query
    const filtros: any = {};

    if (query.statusPagamento) {
      filtros.status = query.statusPagamento;
    }

    if (query.contratoId) {
      filtros.contratoId = parseInt(query.contratoId as string);
    }

    if (query.valorMinimo) {
      filtros.valorEmAberto = {
        gte: parseFloat(query.valorMinimo as string),
      };
    }

    if (query.valorMaximo) {
      filtros.valorEmAberto = {
        ...(filtros.valorEmAberto || {}),
        lte: parseFloat(query.valorMaximo as string),
      };
    }

    if (query.diasAtrasoMin) {
      filtros.diasAtraso = {
        gte: parseInt(query.diasAtrasoMin as string),
      };
    }

    if (query.diasAtrasoMax) {
      filtros.diasAtraso = {
        ...(filtros.diasAtraso || {}),
        lte: parseInt(query.diasAtrasoMax as string),
      };
    }

    // Buscar os clientes inadimplentes com base nos filtros
    const clientesInadimplentes = await this.prisma.clienteInadimplente.findMany({
      where: filtros,
      include: {
        cliente: true,
        parcelas: true,
      },
    });

    // Retornar os dados formatados
    return clientesInadimplentes.map((clienteInadimplente) => ({
      id: clienteInadimplente.id,
      cliente: {
        id: clienteInadimplente.cliente.id,
        nome: clienteInadimplente.cliente.nome,
        cpfCnpj: clienteInadimplente.cliente.cpfCnpj,
      },
      contratoId: clienteInadimplente.contratoId,
      valorEmAberto: clienteInadimplente.valorEmAberto,
      diasAtraso: clienteInadimplente.diasAtraso,
      ultimaCobranca: clienteInadimplente.ultimaCobranca,
      status: clienteInadimplente.status,
      parcelas: clienteInadimplente.parcelas,
    }));
  }

  async obterClienteInadimplente(id: number) {
    const clienteInadimplente = await this.prisma.clienteInadimplente.findUnique({
      where: { id },
      include: {
        cliente: true,
        parcelas: true,
      },
    });

    if (!clienteInadimplente) {
      throw new NotFoundException(`Cliente inadimplente ID ${id} não encontrado`);
    }

    return {
      id: clienteInadimplente.id,
      cliente: {
        id: clienteInadimplente.cliente.id,
        nome: clienteInadimplente.cliente.nome,
        cpfCnpj: clienteInadimplente.cliente.cpfCnpj,
      },
      contratoId: clienteInadimplente.contratoId,
      valorEmAberto: clienteInadimplente.valorEmAberto,
      diasAtraso: clienteInadimplente.diasAtraso,
      ultimaCobranca: clienteInadimplente.ultimaCobranca,
      status: clienteInadimplente.status,
      parcelas: clienteInadimplente.parcelas,
    };
  }

  async obterHistoricoInteracoes(clienteId: number) {
    const interacoes = await this.prisma.interacao.findMany({
      where: { clienteId },
      orderBy: { data: 'desc' },
    });

    return interacoes;
  }

  async registrarInteracao(clienteId: number, dados: RegistrarInteracaoDto) {
    // Verificar se o cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: clienteId },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente ID ${clienteId} não encontrado`);
    }

    // Registrar a interação
    return this.prisma.interacao.create({
      data: {
        id: uuidv4(),
        clienteId,
        tipo: dados.tipo,
        data: new Date(),
        observacao: dados.observacao,
        usuario: dados.usuario,
        parcelaId: dados.parcelaId,
      },
    });
  }

  async obterHistoricoComunicacoes(clienteId: number) {
    const comunicacoes = await this.prisma.comunicacao.findMany({
      where: { clienteId },
      orderBy: { data: 'desc' },
    });

    return comunicacoes;
  }

  async enviarComunicacao(dados: EnviarComunicacaoDto) {
    // Verificar se o cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: dados.clienteId },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente ID ${dados.clienteId} não encontrado`);
    }

    // Em um cenário real, aqui seria feita a integração com um serviço de envio de email/SMS/WhatsApp
    // Simulação de envio
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Registrar a comunicação
    const comunicacao = await this.prisma.comunicacao.create({
      data: {
        id: uuidv4(),
        clienteId: dados.clienteId,
        tipo: dados.tipo,
        data: new Date(),
        mensagem: dados.mensagem,
        status: 'enviado',
        anexos: dados.anexos ? { anexos: dados.anexos } : undefined,
      },
    });

    // Atualizar a data da última cobrança do cliente inadimplente
    await this.prisma.clienteInadimplente.updateMany({
      where: { clienteId: dados.clienteId },
      data: { ultimaCobranca: new Date() },
    });

    return comunicacao;
  }

  async gerarNovoBoleto(clienteId: number, parcelaId: number, dados: GerarBoletoDto) {
    // Verificar se o cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: clienteId },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente ID ${clienteId} não encontrado`);
    }

    // Verificar se a parcela existe
    const parcela = await this.prisma.parcelaInadimplente.findUnique({
      where: { id: parcelaId },
    });

    if (!parcela) {
      throw new NotFoundException(`Parcela ID ${parcelaId} não encontrada`);
    }

    // Em um cenário real, aqui seria feita a integração com um serviço de geração de boletos
    // Simulação de geração de boleto
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Gerar dados fictícios para o boleto
    const boleto = {
      id: Date.now(),
      clienteId,
      clienteNome: cliente.nome,
      contratoId: parcela.clienteInadimplente_id, // Relacionamento com o contrato da parcela
      valor: parcela.valorAtualizado,
      dataVencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Vencimento em 7 dias
      numeroParcela: parcela.numero,
      descricao: `Nova emissão - Parcela ${parcela.numero}`,
      nossoNumero: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      linhaDigitavel: `${Date.now()}${Math.floor(Math.random() * 10000)}`,
      codigoBarras: `${Date.now()}${Math.floor(Math.random() * 100000)}`,
      pdfUrl: `/uploads/boletos/boleto_${Date.now()}.pdf`,
      dataGeracao: new Date(),
      status: 'gerado',
    };

    // Registrar o boleto no banco de dados
    return this.prisma.boleto.create({
      data: boleto,
    });
  }

  async obterGatilhos() {
    // Buscar configuração de gatilhos do banco de dados
    let configuracao = await this.prisma.configuracaoGatilhos.findFirst();

    // Se não existir, criar uma configuração padrão
    if (!configuracao) {
      configuracao = await this.prisma.configuracaoGatilhos.create({
        data: {
          executarAutomaticamente: true,
          horarioExecucao: '08:00',
          diasExecucao: ['1', '3', '5'], // Segunda, Quarta, Sexta
          repetirCobrancas: true,
          intervaloRepeticao: 7,
          limitarRepeticoes: true,
          limiteRepeticoes: 3,
          gerarLog: true,
          gatilhos: [
            { dias: 7, tipo: 'email', ativo: true, mensagem: 'Lembrete: Você possui uma parcela em atraso.' },
            { dias: 15, tipo: 'sms', ativo: true, mensagem: 'Sua parcela está em atraso há 15 dias. Entre em contato.' },
            { dias: 30, tipo: 'whatsapp', ativo: true, mensagem: 'Importante: Parcela em atraso há 30 dias. Acesse o link para regularizar.' },
          ],
        },
      });
    }

    return configuracao;
  }

  async salvarGatilhos(dados: SalvarGatilhosDto) {
    // Buscar configuração existente ou criar uma nova
    const configuracaoExistente = await this.prisma.configuracaoGatilhos.findFirst();

    if (configuracaoExistente) {
      // Atualizar configuração existente
      return this.prisma.configuracaoGatilhos.update({
        where: { id: configuracaoExistente.id },
        data: {
          gatilhos: dados.gatilhos,
        },
      });
    } else {
      // Criar nova configuração
      return this.prisma.configuracaoGatilhos.create({
        data: {
          executarAutomaticamente: true,
          horarioExecucao: '08:00',
          diasExecucao: ['1', '3', '5'], // Segunda, Quarta, Sexta
          repetirCobrancas: true,
          intervaloRepeticao: 7,
          limitarRepeticoes: true,
          limiteRepeticoes: 3,
          gerarLog: true,
          gatilhos: dados.gatilhos,
        },
      });
    }
  }

  async enviarCobrancaAutomatica(dados: any) {
    // Verificar se o cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: dados.clienteId },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente ID ${dados.clienteId} não encontrado`);
    }

    // Em um cenário real, aqui seria feita a integração com um serviço de envio de comunicações
    // Simulação de envio
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Registrar a comunicação
    const comunicacao = await this.prisma.comunicacao.create({
      data: {
        id: uuidv4(),
        clienteId: dados.clienteId,
        tipo: dados.gatilho.tipo,
        data: new Date(),
        mensagem: dados.gatilho.mensagem,
        status: 'enviado',
        parcelaInfo: { parcelaId: dados.parcelaId },
      },
    });

    // Atualizar a data da última cobrança do cliente inadimplente
    await this.prisma.clienteInadimplente.updateMany({
      where: { clienteId: dados.clienteId },
      data: { ultimaCobranca: new Date() },
    });

    return comunicacao;
  }

  async exportarDados(formato: string, filtros: QueryInadimplenciaDto) {
    // Buscar os dados com base nos filtros
    const clientesInadimplentes = await this.listarClientesInadimplentes(filtros);

    // Em um cenário real, aqui seria gerado o arquivo no formato solicitado (Excel ou PDF)
    // Simulação de geração de arquivo
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Retornar os dados
    return {
      dados: clientesInadimplentes,
      formato,
      dataGeracao: new Date(),
    };
  }
}