import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
//import { UpdateBoletoDto } from './dto/update-boleto.dto';

@Injectable()
export class BoletosService {
  constructor(private readonly prisma: PrismaService) {}

  async gerarBoleto(createBoletoDto: CreateBoletoDto) {
    // Verificando se o cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: createBoletoDto.clienteId }
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente ID ${createBoletoDto.clienteId} não encontrado`);
    }
    
    // Verificando se o contrato existe
    const contrato = await this.prisma.contrato.findUnique({
      where: { id: createBoletoDto.contratoId }
    });
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${createBoletoDto.contratoId} não encontrado`);
    }
    
    // Gerando o número único do boleto se não foi fornecido
    const nossoNumero = createBoletoDto.nossoNumero || this.gerarNossoNumero();
    
    // Gerando linha digitável e código de barras se não foram fornecidos
    const linhaDigitavel = createBoletoDto.linhaDigitavel || this.gerarLinhaDigitavel(nossoNumero);
    const codigoBarras = createBoletoDto.codigoBarras || this.gerarCodigoBarras(nossoNumero);
    
    // URL do PDF do boleto
    const pdfUrl = createBoletoDto.pdfUrl || `https://api.sistema.com/boletos/${nossoNumero}/pdf`;
    
    // Criando o boleto
    const boleto = await this.prisma.boleto.create({
      data: {
        ...createBoletoDto,
        nossoNumero,
        linhaDigitavel,
        codigoBarras,
        pdfUrl,
        dataGeracao: new Date(),
        status: 'gerado'
      }
    });
    
    return boleto;
  }

  async findAll(query: any) {
    const filters = {};
    
    if (query.clienteId) {
      filters['clienteId'] = Number(query.clienteId);
    }
    
    if (query.contratoId) {
      filters['contratoId'] = Number(query.contratoId);
    }
    
    if (query.status) {
      filters['status'] = query.status;
    }
    
    if (query.dataInicio && query.dataFim) {
      filters['dataVencimento'] = {
        gte: new Date(query.dataInicio),
        lte: new Date(query.dataFim)
      };
    }
    
    if (query.busca) {
      filters['OR'] = [
        { nossoNumero: { contains: query.busca } },
        { descricao: { contains: query.busca, mode: 'insensitive' } },
        { linhaDigitavel: { contains: query.busca } },
        { clienteNome: { contains: query.busca, mode: 'insensitive' } }
      ];
    }
    
    return this.prisma.boleto.findMany({
      where: filters,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            cpfCnpj: true
          }
        },
        contrato: {
          select: {
            id: true,
            valorTotal: true,
            numeroParcelas: true
          }
        }
      }
    });
  }

  async findOne(id: number) {
    const boleto = await this.prisma.boleto.findUnique({
      where: { id },
      include: {
        cliente: true,
        contrato: true
      }
    });
    
    if (!boleto) {
      throw new NotFoundException(`Boleto ID ${id} não encontrado`);
    }
    
    return boleto;
  }

  async cancel(id: number) {
    // Verificando se o boleto existe
    const boleto = await this.findOne(id);
    
    if (boleto.status === 'pago') {
      throw new Error('Não é possível cancelar um boleto já pago');
    }
    
    return this.prisma.boleto.update({
      where: { id },
      data: {
        status: 'cancelado',
        dataCancelamento: new Date()
      }
    });
  }

  async registrarPagamento(id: number, dadosPagamento: any) {
    // Verificando se o boleto existe
    const boleto = await this.findOne(id);
    
    if (boleto.status === 'cancelado') {
      throw new Error('Não é possível registrar pagamento de um boleto cancelado');
    }
    
    if (boleto.status === 'pago') {
      throw new Error('Boleto já está pago');
    }
    
    // Atualizando o boleto
    const boletoPago = await this.prisma.boleto.update({
      where: { id },
      data: {
        status: 'pago',
        dataPagamento: dadosPagamento.dataPagamento || new Date(),
        valorPago: dadosPagamento.valorPago || boleto.valor,
        formaPagamento: dadosPagamento.formaPagamento || 'manual',
        comprovante: dadosPagamento.comprovante
      }
    });
    
    // Atualizando o número de parcelas pagas no contrato
    await this.prisma.contrato.update({
      where: { id: boleto.contratoId },
      data: {
        parcelasPagas: {
          increment: 1
        }
      }
    });
    
    return boletoPago;
  }

  // Métodos auxiliares para geração de dados de boleto
  private gerarNossoNumero(): string {
    return Math.floor(10000000000 + Math.random() * 90000000000).toString();
  }

  private gerarLinhaDigitavel(nossoNumero: string): string {
    const parte1 = nossoNumero.substring(0, 5);
    const parte2 = nossoNumero.substring(5, 10);
    const parte3 = nossoNumero.substring(10, 11);
    const parte4 = Math.floor(1000 + Math.random() * 9000).toString();
    
    return `10492.${parte1}.${parte2}.${parte3}.${parte4}`;
  }

  private gerarCodigoBarras(nossoNumero: string): string {
    return `104${Math.floor(10000000000000000000000000000000000000000 + Math.random() * 90000000000000000000000000000000000000000).toString()}`;
  }
}