import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
    try {
      // Construir consulta básica para boletos vencidos
      const hoje = new Date();
      
      // Busca boletos vencidos
      const boletosVencidos = await this.prisma.boleto.findMany({
        where: {
          status: 'gerado',
          dataVencimento: {
            lt: hoje
          }
        },
        include: {
          cliente: {
            include: {
              contatos: true
            }
          },
          contrato: true
        }
      });
      
      // Agrupar por cliente
      const clientesMap = new Map();
      
      for (const boleto of boletosVencidos) {
        const clienteId = boleto.clienteId;
        const contratoId = boleto.contratoId;
        
        // Calcular dias de atraso
        const dataVencimento = boleto.dataVencimento;
        const diffTime = Math.abs(hoje.getTime() - dataVencimento.getTime());
        const diasAtraso = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const key = `${clienteId}-${contratoId}`;
        
        if (!clientesMap.has(key)) {
          clientesMap.set(key, {
            id: clienteId, // Usamos clienteId como ID temporário
            clienteId: clienteId,
            contratoId: contratoId,
            valorEmAberto: 0,
            diasAtraso: 0,
            status: 'pendente',
            cliente: boleto.cliente,
            contrato: boleto.contrato,
            parcelas: []
          });
        }
        
        const clienteInfo = clientesMap.get(key);
        
        // Atualiza valor em aberto
        clienteInfo.valorEmAberto += Number(boleto.valor);
        
        // Pega o maior número de dias de atraso
        if (diasAtraso > clienteInfo.diasAtraso) {
          clienteInfo.diasAtraso = diasAtraso;
        }
        
        // Adiciona parcela
        clienteInfo.parcelas.push({
          id: boleto.id,
          numero: boleto.numeroParcela,
          dataVencimento: boleto.dataVencimento,
          valor: Number(boleto.valor),
          valorAtualizado: Number(boleto.valor), // Aqui poderia aplicar juros/multa
          status: 'vencido'
        });
      }
      
      // Converter para array e aplicar filtros
      let clientesInadimplentes = Array.from(clientesMap.values());
      
      // Aplicar filtros
      if (query.clienteId) {
        clientesInadimplentes = clientesInadimplentes.filter(c => c.clienteId === query.clienteId);
      }
      
      if (query.contratoId) {
        clientesInadimplentes = clientesInadimplentes.filter(c => c.contratoId === query.contratoId);
      }
      
      if (query.status) {
        clientesInadimplentes = clientesInadimplentes.filter(c => c.status === query.status);
      }
      
      if (query.diasAtrasoMin) {
        clientesInadimplentes = clientesInadimplentes.filter(c => c.diasAtraso >= query.diasAtrasoMin);
      }
      
      if (query.diasAtrasoMax) {
        clientesInadimplentes = clientesInadimplentes.filter(c => c.diasAtraso <= query.diasAtrasoMax);
      }
      
      if (query.valorMinimo) {
        clientesInadimplentes = clientesInadimplentes.filter(c => c.valorEmAberto >= query.valorMinimo);
      }
      
      if (query.valorMaximo) {
        clientesInadimplentes = clientesInadimplentes.filter(c => c.valorEmAberto <= query.valorMaximo);
      }
      
      // Ordenar por dias de atraso (maior para menor)
      clientesInadimplentes.sort((a, b) => b.diasAtraso - a.diasAtraso);
      
      return clientesInadimplentes;
    } catch (error) {
      console.error('Erro ao listar clientes inadimplentes:', error);
      throw new InternalServerErrorException('Erro ao listar clientes inadimplentes: ' + error.message);
    }
  }

  async obterClienteInadimplente(id: number) {
    try {
      // Como estamos trabalhando com objetos em memória, vamos buscar direto por boletos
      const boleto = await this.prisma.boleto.findUnique({
        where: { id },
        include: {
          cliente: {
            include: {
              endereco: true,
              contatos: true
            }
          },
          contrato: true
        }
      });
      
      if (!boleto) {
        throw new NotFoundException(`Boleto ID ${id} não encontrado`);
      }
      
      // Calcula dias de atraso
      const hoje = new Date();
      const dataVencimento = boleto.dataVencimento;
      const diffTime = Math.abs(hoje.getTime() - dataVencimento.getTime());
      const diasAtraso = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Constrói o objeto de cliente inadimplente
      const clienteInadimplente = {
        id: boleto.id,
        clienteId: boleto.clienteId,
        contratoId: boleto.contratoId,
        valorEmAberto: Number(boleto.valor),
        diasAtraso,
        status: 'pendente',
        cliente: boleto.cliente,
        contrato: boleto.contrato,
        parcelas: [{
          id: boleto.id,
          numero: boleto.numeroParcela,
          dataVencimento: boleto.dataVencimento,
          valor: Number(boleto.valor),
          valorAtualizado: Number(boleto.valor),
          status: 'vencido'
        }]
      };
      
      return clienteInadimplente;
    } catch (error) {
      console.error(`Erro ao obter cliente inadimplente ${id}:`, error);
      throw new InternalServerErrorException(`Erro ao obter cliente inadimplente: ${error.message}`);
    }
  }

  async registrarInteracao(clienteId: number, createInteracaoDto: CreateInteracaoDto) {
    try {
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
    } catch (error) {
      console.error(`Erro ao registrar interação para cliente ${clienteId}:`, error);
      throw new InternalServerErrorException(`Erro ao registrar interação: ${error.message}`);
    }
  }

  async obterHistoricoInteracoes(clienteId: number) {
    try {
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
    } catch (error) {
      console.error(`Erro ao obter histórico de interações para cliente ${clienteId}:`, error);
      throw new InternalServerErrorException(`Erro ao obter histórico de interações: ${error.message}`);
    }
  }

  async gerarNovoBoleto(clienteId: number, parcelaId: string) {
    try {
      // Verificando se o cliente existe
      const cliente = await this.prisma.cliente.findUnique({
        where: { id: clienteId }
      });
      
      if (!cliente) {
        throw new NotFoundException(`Cliente ID ${clienteId} não encontrado`);
      }
      
      // Verificando a parcela para achar o contrato e valor
      const boleto = await this.prisma.boleto.findUnique({
        where: { id: parseInt(parcelaId) }
      });
      
      if (!boleto) {
        throw new NotFoundException(`Parcela ID ${parcelaId} não encontrada`);
      }
      
      // Criar novo boleto com data de vencimento atualizada
      const hoje = new Date();
      const novaDataVencimento = new Date(hoje);
      novaDataVencimento.setDate(hoje.getDate() + 7); // 7 dias no futuro

      // Geramos aqui um número único para o boleto
      const nossoNumero = Math.floor(10000000000 + Math.random() * 90000000000).toString();
      const linhaDigitavel = `10492.${nossoNumero.substring(0, 5)}.${nossoNumero.substring(5, 10)}.${nossoNumero.substring(10, 11)}.${Math.floor(1000 + Math.random() * 9000)}`;
      const codigoBarras = `104${Math.floor(10000000000000000000000000000000000000000 + Math.random() * 90000000000000000000000000000000000000000).toString()}`;
      
      // Criamos o novo boleto
      const novoBoleto = await this.prisma.boleto.create({
        data: {
          clienteId: boleto.clienteId,
          clienteNome: boleto.clienteNome,
          contratoId: boleto.contratoId,
          valor: boleto.valor,
          dataVencimento: novaDataVencimento,
          numeroParcela: boleto.numeroParcela,
          descricao: `${boleto.descricao} (Nova emissão)`,
          nossoNumero,
          linhaDigitavel,
          codigoBarras,
          pdfUrl: `https://api.sistema.com/boletos/${nossoNumero}/pdf`,
          status: 'gerado'
        }
      });
      
      return novoBoleto;
    } catch (error) {
      console.error(`Erro ao gerar novo boleto para cliente ${clienteId}:`, error);
      throw new InternalServerErrorException(`Erro ao gerar novo boleto: ${error.message}`);
    }
  }

  async obterGatilhos() {
    try {
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
      
      return {
        ...configuracao,
        gatilhos: configuracao.gatilhos ? JSON.parse(JSON.stringify(configuracao.gatilhos)) : []
      };
    } catch (error) {
      console.error('Erro ao obter configurações de gatilhos:', error);
      throw new InternalServerErrorException(`Erro ao obter configurações de gatilhos: ${error.message}`);
    }
  }

  async salvarGatilhos(configuracaoGatilhosDto: ConfiguracaoGatilhosDto) {
    try {
      const configuracao = await this.prisma.configuracaoGatilhos.findFirst();
      
      // Converter os gatilhos para JSON
      const gatilhosJson = JSON.parse(JSON.stringify(configuracaoGatilhosDto.gatilhos));
      
      if (!configuracao) {
        // Cria nova configuração
        return this.prisma.configuracaoGatilhos.create({
          data: {
            executarAutomaticamente: configuracaoGatilhosDto.executarAutomaticamente,
            horarioExecucao: configuracaoGatilhosDto.horarioExecucao,
            diasExecucao: configuracaoGatilhosDto.diasExecucao,
            repetirCobrancas: configuracaoGatilhosDto.repetirCobrancas,
            intervaloRepeticao: configuracaoGatilhosDto.intervaloRepeticao,
            limitarRepeticoes: configuracaoGatilhosDto.limitarRepeticoes,
            limiteRepeticoes: configuracaoGatilhosDto.limiteRepeticoes,
            gerarLog: configuracaoGatilhosDto.gerarLog,
            gatilhos: gatilhosJson
          }
        });
      }
      
      // Atualiza configuração existente
      return this.prisma.configuracaoGatilhos.update({
        where: { id: configuracao.id },
        data: {
          executarAutomaticamente: configuracaoGatilhosDto.executarAutomaticamente,
          horarioExecucao: configuracaoGatilhosDto.horarioExecucao,
          diasExecucao: configuracaoGatilhosDto.diasExecucao,
          repetirCobrancas: configuracaoGatilhosDto.repetirCobrancas,
          intervaloRepeticao: configuracaoGatilhosDto.intervaloRepeticao,
          limitarRepeticoes: configuracaoGatilhosDto.limitarRepeticoes,
          limiteRepeticoes: configuracaoGatilhosDto.limiteRepeticoes,
          gerarLog: configuracaoGatilhosDto.gerarLog,
          gatilhos: gatilhosJson
        }
      });
    } catch (error) {
      console.error('Erro ao salvar configurações de gatilhos:', error);
      throw new InternalServerErrorException(`Erro ao salvar configurações de gatilhos: ${error.message}`);
    }
  }

  async enviarComunicacao(createComunicacaoDto: CreateComunicacaoDto) {
    try {
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
    } catch (error) {
      console.error(`Erro ao enviar comunicação para cliente ${createComunicacaoDto.clienteId}:`, error);
      throw new InternalServerErrorException(`Erro ao enviar comunicação: ${error.message}`);
    }
  }

  async obterHistoricoComunicacoes(clienteId: number) {
    try {
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
    } catch (error) {
      console.error(`Erro ao obter histórico de comunicações para cliente ${clienteId}:`, error);
      throw new InternalServerErrorException(`Erro ao obter histórico de comunicações: ${error.message}`);
    }
  }

  async enviarCobrancaAutomatica(clienteId: number, parcelaId: string, gatilho: any) {
    try {
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
      
      // Obtendo informações do boleto/parcela
      const boleto = await this.prisma.boleto.findUnique({
        where: { id: parseInt(parcelaId) }
      });
      
      if (!boleto) {
        throw new NotFoundException(`Parcela/Boleto ID ${parcelaId} não encontrado`);
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
            parcelaId: parcelaId,
            //valor: parcela.valor.toString(), // ou parcela.valor.toNumber()
            //dataVencimento: parcela.dataVencimento.toISOString()
          }
        }
      });
      
      return comunicacao;
    } catch (error) {
      console.error(`Erro ao enviar cobrança automática para cliente ${clienteId}:`, error);
      throw new InternalServerErrorException(`Erro ao enviar cobrança automática: ${error.message}`);
    }
  }

  async exportarDados(formato: string, query: QueryInadimplenciaDto) {
    try {
      // Busca os dados de inadimplência com base nos filtros
      const dados = await this.listarClientesInadimplentes(query);
      
      // Simula a exportação para diferentes formatos
      switch (formato) {
        case 'excel':
          // Simulando retorno de um arquivo Excel
          return {
            data: Buffer.from('Simulação de arquivo Excel'),
            tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            nome: `inadimplentes_${new Date().toISOString().split('T')[0]}.xlsx`
          };
        
        case 'pdf':
          // Simulando retorno de um arquivo PDF
          return {
            data: Buffer.from('Simulação de arquivo PDF'),
            tipo: 'application/pdf',
            nome: `inadimplentes_${new Date().toISOString().split('T')[0]}.pdf`
          };
        
        default:
          throw new Error('Formato de exportação não suportado');
      }
    } catch (error) {
      console.error(`Erro ao exportar dados em formato ${formato}:`, error);
      throw new InternalServerErrorException(`Erro ao exportar dados: ${error.message}`);
    }
  }
}