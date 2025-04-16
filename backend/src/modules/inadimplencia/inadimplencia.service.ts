import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClienteInadimplenteDto } from './dto/cliente-inadimplente.dto';
import { UpdateClienteInadimplenteDto } from './dto/update-cliente-inadimplente.dto';
import { QueryInadimplenciaDto } from './dto/query-inadimplencia.dto';
import { CreateInteracaoDto } from './dto/interacao.dto';
import { CreateComunicacaoDto } from './dto/comunicacao.dto';
import { ConfiguracaoGatilhosDto } from './dto/gatilho.dto';

@Injectable()
export class InadimplenciaService {
  constructor(private readonly prisma: PrismaService) {}

  async listarClientesInadimplentes(query: QueryInadimplenciaDto) {
    const filters = {};
    
    if (query.clienteId) {
      filters['clienteId'] = query.clienteId;
    }
    
    if (query.contratoId) {
      filters['contratoId'] = query.contratoId;
    }
    
    if (query.status) {
      filters['status'] = query.status;
    }
    
    if (query.diasAtrasoMin || query.diasAtrasoMax) {
      filters['diasAtraso'] = {};
      
      if (query.diasAtrasoMin) {
        filters['diasAtraso']['gte'] = query.diasAtrasoMin;
      }
      
      if (query.diasAtrasoMax) {
        filters['diasAtraso']['lte'] = query.diasAtrasoMax;
      }
    }
    
    if (query.valorMinimo || query.valorMaximo) {
      filters['valorEmAberto'] = {};
      
      if (query.valorMinimo) {
        filters['valorEmAberto']['gte'] = query.valorMinimo;
      }
      
      if (query.valorMaximo) {
        filters['valorEmAberto']['lte'] = query.valorMaximo;
      }
    }
    
    if (query.dataUltimaCobrancaInicio || query.dataUltimaCobrancaFim) {
      filters['ultimaCobranca'] = {};
      
      if (query.dataUltimaCobrancaInicio) {
        filters['ultimaCobranca']['gte'] = new Date(query.dataUltimaCobrancaInicio);
      }
      
      if (query.dataUltimaCobrancaFim) {
        filters['ultimaCobranca']['lte'] = new Date(query.dataUltimaCobrancaFim);
      }
    }
    
    return this.prisma.clienteInadimplente.findMany({
      where: filters,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            cpfCnpj: true,
            contatos: true
          }
        },
        parcelas: true
      }
    });
  }

  async obterClienteInadimplente(id: number) {
    const clienteInadimplente = await this.prisma.clienteInadimplente.findUnique({
      where: { id },
      include: {
        cliente: {
          include: {
            endereco: true,
            contatos: true
          }
        },
        parcelas: true
      }
    });
    
    if (!clienteInadimplente) {
      throw new NotFoundException(`Cliente inadimplente ID ${id} não encontrado`);
    }
    
    return clienteInadimplente;
  }

  async registrarInteracao(clienteId: number, createInteracaoDto: CreateInteracaoDto) {
    // Verificando se o cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: clienteId }
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente ID ${clienteId} não encontrado`);
    }
    
    return this.prisma.interacao.create({
      data: {
        ...createInteracaoDto,
        clienteId
      }
    });
  }

  async obterHistoricoInteracoes(clienteId: number) {
    // Verificando se o cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: clienteId }
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente ID ${clienteId} não encontrado`);
    }
    
    return this.prisma.interacao.findMany({
      where: { clienteId },
      orderBy: { data: 'desc' }
    });
  }

  async gerarNovoBoleto(clienteId: number, parcelaId: string) {
    // Implementação simulada - em um ambiente real, integraria com o serviço de boletos
    // Verificando se o cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: clienteId }
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente ID ${clienteId} não encontrado`);
    }
    
    // Verificando se a parcela inadimplente existe
    const parcela = await this.prisma.parcelaInadimplente.findUnique({
      where: { id: parseInt(parcelaId) },
      include: {
        clienteInadimplente: true
      }
    });
    
    if (!parcela) {
      throw new NotFoundException(`Parcela ID ${parcelaId} não encontrada`);
    }
    
    // Simulando a geração de novo boleto
    const novoBoleto = {
      id: Math.floor(Math.random() * 1000) + 1,
      dataVencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias no futuro
      valor: parcela.valorAtualizado,
      status: 'gerado'
    };
    
    return novoBoleto;
  }

  async obterGatilhos() {
    const configuracao = await this.prisma.configuracaoGatilhos.findFirst();
    
    if (!configuracao) {
      // Retorna configuração padrão se não existir
      return {
        executarAutomaticamente: true,
        horarioExecucao: '03:00',
        diasExecucao: ['1', '15'],
        repetirCobrancas: true,
        intervaloRepeticao: 7,
        limitarRepeticoes: true,
        limiteRepeticoes: 3,
        gerarLog: true,
        gatilhos: [
          { dias: 7, tipo: 'email', ativo: true, mensagem: 'Prezado cliente, identificamos que você possui uma parcela com vencimento em 7 dias. Por favor, efetue o pagamento em dia para evitar juros e multas.' },
          { dias: 15, tipo: 'sms', ativo: true, mensagem: 'Sua parcela está em atraso há 15 dias. Entre em contato conosco para regularização.' },
          { dias: 30, tipo: 'whatsapp', ativo: true, mensagem: 'Importante: Parcela em atraso há 30 dias. Acesse o link para regularizar sua situação e evitar negativação do seu CPF.' }
        ]
      };
    }
    
    return configuracao;
  }

  async salvarGatilhos(configuracaoGatilhosDto: ConfiguracaoGatilhosDto) {
    const configuracao = await this.prisma.configuracaoGatilhos.findFirst();
    
    // Converter os gatilhos para JSON
    const gatilhosJson = JSON.parse(JSON.stringify(configuracaoGatilhosDto.gatilhos));
    
    if (!configuracao) {
      // Cria nova configuração
      return this.prisma.configuracaoGatilhos.create({
        data: {
          ...configuracaoGatilhosDto,
          gatilhos: gatilhosJson
        }
      });
    }
    
    // Atualiza configuração existente
    return this.prisma.configuracaoGatilhos.update({
      where: { id: configuracao.id },
      data: {
        ...configuracaoGatilhosDto,
        gatilhos: gatilhosJson
      }
    });
  }

  async enviarComunicacao(createComunicacaoDto: CreateComunicacaoDto) {
    // Verificando se o cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: createComunicacaoDto.clienteId }
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente ID ${createComunicacaoDto.clienteId} não encontrado`);
    }
    
    // Em um ambiente real, aqui seria a integração com serviços de comunicação
    // Como e-mail, SMS, WhatsApp, etc.
    
    // Registrando a comunicação no banco de dados
    return this.prisma.comunicacao.create({
      data: createComunicacaoDto
    });
  }

  async obterHistoricoComunicacoes(clienteId: number) {
    // Verificando se o cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: clienteId }
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente ID ${clienteId} não encontrado`);
    }
    
    return this.prisma.comunicacao.findMany({
      where: { clienteId },
      orderBy: { data: 'desc' }
    });
  }

  async enviarCobrancaAutomatica(clienteId: number, parcelaId: string, gatilho: any) {
    // Verificando se o cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: clienteId },
      include: {
        contatos: true
      }
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente ID ${clienteId} não encontrado`);
    }
    
    // Verificando se a parcela existe
    const parcela = await this.prisma.parcelaInadimplente.findUnique({
      where: { id: parseInt(parcelaId) }
    });
    
    if (!parcela) {
      throw new NotFoundException(`Parcela ID ${parcelaId} não encontrada`);
    }
    
    // Em um ambiente real, aqui seria a integração com serviços de comunicação
    // Com base no tipo de gatilho (email, sms, whatsapp)
    
    // Cria um registro da comunicação
    const comunicacao = await this.prisma.comunicacao.create({
      data: {
        clienteId,
        tipo: gatilho.tipo,
        data: new Date(),
        mensagem: gatilho.mensagem,
        status: 'enviado',
        parcelaInfo: { 
          parcelaId: parseInt(parcelaId),
          valor: parcela.valor,
          dataVencimento: parcela.dataVencimento
        }
      }
    });
    
    // Atualiza a última data de cobrança no cliente inadimplente
    await this.prisma.clienteInadimplente.update({
      where: { 
        id: parcela.clienteInadimplente_id
      },
      data: {
        ultimaCobranca: new Date()
      }
    });
    
    return comunicacao;
  }

  async exportarDados(formato: string, query: QueryInadimplenciaDto) {
    // Busca os dados de inadimplência com base nos filtros
    const dados = await this.listarClientesInadimplentes(query);
    
    // Simula a exportação para diferentes formatos
    switch (formato) {
      case 'excel':
        // Simulando retorno de um arquivo Excel
        return {
          data: 'buffer-simulado',
          tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          nome: `inadimplentes_${new Date().toISOString().split('T')[0]}.xlsx`
        };
      
      case 'pdf':
        // Simulando retorno de um arquivo PDF
        return {
          data: 'buffer-simulado',
          tipo: 'application/pdf',
          nome: `inadimplentes_${new Date().toISOString().split('T')[0]}.pdf`
        };
      
      default:
        throw new Error('Formato de exportação não suportado');
    }
  }
}