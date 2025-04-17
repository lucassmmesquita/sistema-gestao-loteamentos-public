import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReajusteDto } from './dto/create-reajuste.dto';
import { UpdateReajusteDto } from './dto/update-reajuste.dto';
import { ParametrosReajusteDto } from './dto/parametros-reajuste.dto';
import { IndicesEconomicosDto } from './dto/indices-economicos.dto';
import { QueryReajusteDto } from './dto/query-reajuste.dto';

@Injectable()
export class ReajustesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryReajusteDto) {
    const filters = {};
    
    if (query.contratoId) {
      filters['contratoId'] = query.contratoId;
    }
    
    if (query.status) {
      filters['status'] = query.status;
    }
    
    if (query.dataInicio && query.dataFim) {
      filters['dataReferencia'] = {
        gte: new Date(query.dataInicio),
        lte: new Date(query.dataFim)
      };
    }
    
    const reajustes = await this.prisma.reajuste.findMany({
      where: filters,
      include: {
        contrato: {
          select: {
            id: true,
            dataInicio: true,
            //valorParcela : true,
            cliente: {
              select: {
                id: true,
                nome: true,
                cpfCnpj: true
              }
            }
          }
        }
      }
    });
    
    // Se foi passado o filtro de cliente, filtra os resultados
    if (query.cliente) {
      return reajustes.filter(r => r.contrato.cliente.id === query.cliente);
    }
    
    return reajustes;
  }

  async findReajustesPrevistos(dataInicio?: string, dataFim?: string) {
    // Busca todos os contratos ativos
    const contratos = await this.prisma.contrato.findMany({
      where: { status: 'ativo' },
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
    
    // Busca os parâmetros de reajuste
    const parametros = await this.findParametrosReajuste();
    
    // Busca os índices econômicos
    const indices = await this.findIndicesEconomicos();
    
    const dataInicioObj = dataInicio ? new Date(dataInicio) : new Date();
    const dataFimObj = dataFim ? new Date(dataFim) : new Date(dataInicioObj.getFullYear(), dataInicioObj.getMonth() + 1, 0);
    
    // Lista para armazenar os reajustes previstos
    const reajustesPrevistos = [];
    
    // Para cada contrato, verifica se há reajuste previsto no período
    for (const contrato of contratos) {
      const parcelasPagas = contrato.parcelasPagas || 0;
      const proximaParcelaReajuste = Math.ceil((parcelasPagas + 1) / parametros.intervaloParcelas) * parametros.intervaloParcelas;
      
      // Se já não há mais parcelas a pagar, não há reajuste
      if (proximaParcelaReajuste > contrato.numeroParcelas) {
        continue;
      }
      
      // Calcula a data prevista do próximo reajuste
      // (Cálculo simplificado - em um sistema real seria mais complexo)
      const dataInicial = new Date(contrato.dataInicio);
      const mesesReajuste = proximaParcelaReajuste > 0 ? proximaParcelaReajuste - 1 : 0;
      const dataReferencia = new Date(dataInicial);
      dataReferencia.setMonth(dataInicial.getMonth() + mesesReajuste);
      
      // Verifica se a data está dentro do período de pesquisa
      if (dataReferencia >= dataInicioObj && dataReferencia <= dataFimObj) {
        // Calcula o valor reajustado
        const indice = indices[parametros.indiceBase] || 5; // Valor padrão caso não exista
        const percentualAdicional = parametros.percentualAdicional;
        const reajusteTotal = indice + percentualAdicional;
        //const valorOriginal = contrato.valorParcela || 0;
        const valorOriginal =  0;
        const valorReajustado = valorOriginal * (1 + reajusteTotal / 100);
        
        reajustesPrevistos.push({
          id: `preview-${contrato.id}-${proximaParcelaReajuste}`,
          contratoId: contrato.id,
          parcelaReferencia: proximaParcelaReajuste,
          valorOriginal,
          valorReajustado,
          indiceAplicado: indice,
          indiceBase: parametros.indiceBase,
          percentualAdicional,
          reajusteTotal,
          dataReferencia,
          status: 'pendente',
          aplicado: false,
          contrato: {
            id: contrato.id,
            dataInicio: contrato.dataInicio,
            valorParcela: valorOriginal,
            cliente: contrato.cliente
          }
        });
      }
    }
    
    return reajustesPrevistos;
  }

  async findParametrosReajuste() {
    // Busca os parâmetros de reajuste
    let parametros = await this.prisma.parametrosReajuste.findFirst();
    
    // Se não existirem, cria com valores padrão
    if (!parametros) {
      parametros = await this.prisma.parametrosReajuste.create({
        data: {
          indiceBase: 'IGPM',
          percentualAdicional: 6,
          intervaloParcelas: 12,
          alertaAntecipadoDias: 30
        }
      });
    }
    
    return parametros;
  }

  async updateParametrosReajuste(parametrosReajusteDto: ParametrosReajusteDto) {
    // Busca os parâmetros existentes
    const parametrosExistentes = await this.prisma.parametrosReajuste.findFirst();
    
    // Se não existirem, cria
    if (!parametrosExistentes) {
      return this.prisma.parametrosReajuste.create({
        data: parametrosReajusteDto
      });
    }
    
    // Se existirem, atualiza
    return this.prisma.parametrosReajuste.update({
      where: { id: parametrosExistentes.id },
      data: parametrosReajusteDto
    });
  }

  async findIndicesEconomicos() {
    // Busca os índices econômicos mais recentes
    const indicesRecentes = await this.prisma.indicesEconomicos.findFirst({
      orderBy: { data: 'desc' }
    });
    
    // Se não existirem, cria com valores padrão
    if (!indicesRecentes) {
      return this.prisma.indicesEconomicos.create({
        data: {
          IGPM: 5.5,
          IPCA: 4.2,
          INPC: 3.8,
          data: new Date()
        }
      });
    }
    
    return indicesRecentes;
  }

  async updateIndicesEconomicos(indicesEconomicosDto: IndicesEconomicosDto) {
    // Cria um novo registro de índices
    return this.prisma.indicesEconomicos.create({
      data: {
        ...indicesEconomicosDto,
        data: new Date(indicesEconomicosDto.data)
      }
    });
  }

  async aplicarReajuste(contratoId: number) {
    // Verifica se o contrato existe
    const contrato = await this.prisma.contrato.findUnique({
      where: { id: contratoId }
    });
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${contratoId} não encontrado`);
    }
    
    // Busca os parâmetros de reajuste
    const parametros = await this.findParametrosReajuste();
    
    // Busca os índices econômicos
    const indices = await this.findIndicesEconomicos();
    
    // Calcula a próxima parcela que deve ser reajustada
    const parcelasPagas = contrato.parcelasPagas || 0;
    const proximaParcelaReajuste = Math.ceil((parcelasPagas + 1) / parametros.intervaloParcelas) * parametros.intervaloParcelas;
    
    // Verifica se ainda há parcelas a serem reajustadas
    if (proximaParcelaReajuste > contrato.numeroParcelas) {
      throw new Error('Não há mais parcelas a serem reajustadas neste contrato');
    }
    
    // Calcula o reajuste
    const indice = indices[parametros.indiceBase] || 5; // Valor padrão caso não exista
    const percentualAdicional = parametros.percentualAdicional;
    const reajusteTotal = indice + percentualAdicional;
    
    // Use valorTotal / numeroParcelas para obter o valor original de cada parcela
    const valorOriginal = Number(contrato.valorTotal) / contrato.numeroParcelas;
    const valorReajustado = valorOriginal * (1 + reajusteTotal / 100);
    
    // Calcula a data de referência do reajuste
    const dataInicial = new Date(contrato.dataInicio);
    const mesesReajuste = proximaParcelaReajuste > 0 ? proximaParcelaReajuste - 1 : 0;
    const dataReferencia = new Date(dataInicial);
    dataReferencia.setMonth(dataInicial.getMonth() + mesesReajuste);
    
    // Cria o registro de reajuste
    const reajuste = await this.prisma.reajuste.create({
      data: {
        contratoId,
        parcelaReferencia: proximaParcelaReajuste,
        valorOriginal,
        valorReajustado,
        indiceAplicado: indice,
        indiceBase: parametros.indiceBase,
        percentualAdicional,
        reajusteTotal,
        dataReferencia,
        dataAplicacao: new Date(),
        status: 'aplicado',
        aplicado: true
      }
    });
    
    // Atualiza o valor da parcela no contrato usando ultimoReajuste
    await this.prisma.contrato.update({
      where: { id: contratoId },
      data: {
        ultimoReajuste: {
          //data: data.toISOString(), // Converter Date para string ISO
          indice: indice,
          //valorParcela: valorParcela,
          //parcelaReferencia: parcelaReferencia
        }
      }
    });
    
    return reajuste;
  }

  async simularReajuste(contratoId: number, parametrosOverride: Partial<ParametrosReajusteDto> = {}) {
    // Verifica se o contrato existe
    const contrato = await this.prisma.contrato.findUnique({
      where: { id: contratoId },
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
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${contratoId} não encontrado`);
    }
    
    // Busca os parâmetros de reajuste
    const parametrosBase = await this.findParametrosReajuste();
    
    // Mescla os parâmetros base com os override
    const parametros = { ...parametrosBase, ...parametrosOverride };
    
    // Busca os índices econômicos
    const indices = await this.findIndicesEconomicos();
    
    // Calcula a próxima parcela que deve ser reajustada
    const parcelasPagas = contrato.parcelasPagas || 0;
    const proximaParcelaReajuste = Math.ceil((parcelasPagas + 1) / parametros.intervaloParcelas) * parametros.intervaloParcelas;
    
    // Verifica se ainda há parcelas a serem reajustadas
    if (proximaParcelaReajuste > contrato.numeroParcelas) {
      throw new Error('Não há mais parcelas a serem reajustadas neste contrato');
    }
    
    // Calcula o reajuste
    const indice = indices[parametros.indiceBase] || 5; // Valor padrão caso não exista
    const percentualAdicional = parametros.percentualAdicional;
    const reajusteTotal = indice + percentualAdicional;
    
    // Use valorTotal / numeroParcelas para obter o valor original de cada parcela
    const valorOriginal = Number(contrato.valorTotal) / contrato.numeroParcelas;
    const valorReajustado = valorOriginal * (1 + reajusteTotal / 100);
    
    // Calcula a data de referência do reajuste
    const dataInicial = new Date(contrato.dataInicio);
    const mesesReajuste = proximaParcelaReajuste > 0 ? proximaParcelaReajuste - 1 : 0;
    const dataReferencia = new Date(dataInicial);
    dataReferencia.setMonth(dataInicial.getMonth() + mesesReajuste);
    
    // Retorna a simulação
    return {
      contratoId,
      contrato: {
        numero: `#${contrato.id}`,
        valorAtual: valorOriginal
      },
      proximaParcelaReajuste,
      valorOriginal,
      valorReajustado,
      indiceAplicado: indice,
      indiceBase: parametros.indiceBase,
      percentualAdicional,
      reajusteTotal,
      dataReferencia,
      simulado: true
    };
  }

  async findHistoricoReajustes(contratoId: number) {
    // Verifica se o contrato existe
    const contrato = await this.prisma.contrato.findUnique({
      where: { id: contratoId }
    });
    
    if (!contrato) {
      throw new NotFoundException(`Contrato ID ${contratoId} não encontrado`);
    }
    
    // Busca os reajustes do contrato
    return this.prisma.reajuste.findMany({
      where: { contratoId },
      orderBy: { dataReferencia: 'desc' }
    });
  }

  async gerarRelatorioReajustes(query: QueryReajusteDto) {
    // Busca os reajustes com base nos filtros
    const reajustes = await this.findAll(query);
    
    // Agrupa os reajustes por contrato
    const reajustesPorContrato = {};
    
    for (const reajuste of reajustes) {
      const contratoId = reajuste.contratoId;
      if (!reajustesPorContrato[contratoId]) {
        reajustesPorContrato[contratoId] = [];
      }
      
      reajustesPorContrato[contratoId].push(reajuste);
    }
    
    // Monta o relatório
    const relatorio = Object.entries(reajustesPorContrato).map(([contratoId, reajustesContrato]) => {
      // Convertendo de unknown para array do tipo correto
      const reajustesArray = reajustesContrato as any[];
      const contrato = reajustesArray[0].contrato;
      const cliente = contrato.cliente;
      
      // Ordena os reajustes por data
      const reajustesOrdenados = [...reajustesArray].sort(
        (a, b) => new Date(a.dataReferencia).getTime() - new Date(b.dataReferencia).getTime()
      );
      
      // Calcula o valor total do reajuste
      const valorTotalOriginal = reajustesOrdenados.reduce((sum, r) => sum + r.valorOriginal, 0);
      const valorTotalReajustado = reajustesOrdenados.reduce((sum, r) => sum + r.valorReajustado, 0);
      const diferencaTotal = valorTotalReajustado - valorTotalOriginal;
      
      return {
        contratoId: Number(contratoId),
        numeroContrato: `#${contratoId}`,
        cliente: cliente.nome || 'Cliente não identificado',
        documentoCliente: cliente.cpfCnpj || 'Documento não disponível',
        reajustes: reajustesOrdenados,
        valorTotalOriginal,
        valorTotalReajustado,
        diferencaTotal,
        percentualAcumulado: (diferencaTotal / valorTotalOriginal) * 100
      };
    });
    
    return {
      dataCriacao: new Date().toISOString(),
      totalContratos: relatorio.length,
      filtrosAplicados: query,
      contratos: relatorio
    };
  }
}