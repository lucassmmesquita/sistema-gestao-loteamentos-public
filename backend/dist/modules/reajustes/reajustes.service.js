"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReajustesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ReajustesService = class ReajustesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
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
        if (query.cliente) {
            return reajustes.filter(r => r.contrato.cliente.id === query.cliente);
        }
        return reajustes;
    }
    async findReajustesPrevistos(dataInicio, dataFim) {
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
        const parametros = await this.findParametrosReajuste();
        const indices = await this.findIndicesEconomicos();
        const dataInicioObj = dataInicio ? new Date(dataInicio) : new Date();
        const dataFimObj = dataFim ? new Date(dataFim) : new Date(dataInicioObj.getFullYear(), dataInicioObj.getMonth() + 1, 0);
        const reajustesPrevistos = [];
        for (const contrato of contratos) {
            const parcelasPagas = contrato.parcelasPagas || 0;
            const proximaParcelaReajuste = Math.ceil((parcelasPagas + 1) / parametros.intervaloParcelas) * parametros.intervaloParcelas;
            if (proximaParcelaReajuste > contrato.numeroParcelas) {
                continue;
            }
            const dataInicial = new Date(contrato.dataInicio);
            const mesesReajuste = proximaParcelaReajuste > 0 ? proximaParcelaReajuste - 1 : 0;
            const dataReferencia = new Date(dataInicial);
            dataReferencia.setMonth(dataInicial.getMonth() + mesesReajuste);
            if (dataReferencia >= dataInicioObj && dataReferencia <= dataFimObj) {
                const indice = indices[parametros.indiceBase] || 5;
                const percentualAdicional = parametros.percentualAdicional;
                const reajusteTotal = indice + percentualAdicional;
                const valorOriginal = 0;
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
        let parametros = await this.prisma.parametrosReajuste.findFirst();
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
    async updateParametrosReajuste(parametrosReajusteDto) {
        const parametrosExistentes = await this.prisma.parametrosReajuste.findFirst();
        if (!parametrosExistentes) {
            return this.prisma.parametrosReajuste.create({
                data: parametrosReajusteDto
            });
        }
        return this.prisma.parametrosReajuste.update({
            where: { id: parametrosExistentes.id },
            data: parametrosReajusteDto
        });
    }
    async findIndicesEconomicos() {
        const indicesRecentes = await this.prisma.indicesEconomicos.findFirst({
            orderBy: { data: 'desc' }
        });
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
    async updateIndicesEconomicos(indicesEconomicosDto) {
        return this.prisma.indicesEconomicos.create({
            data: Object.assign(Object.assign({}, indicesEconomicosDto), { data: new Date(indicesEconomicosDto.data) })
        });
    }
    async aplicarReajuste(contratoId) {
        const contrato = await this.prisma.contrato.findUnique({
            where: { id: contratoId }
        });
        if (!contrato) {
            throw new common_1.NotFoundException(`Contrato ID ${contratoId} não encontrado`);
        }
        const parametros = await this.findParametrosReajuste();
        const indices = await this.findIndicesEconomicos();
        const parcelasPagas = contrato.parcelasPagas || 0;
        const proximaParcelaReajuste = Math.ceil((parcelasPagas + 1) / parametros.intervaloParcelas) * parametros.intervaloParcelas;
        if (proximaParcelaReajuste > contrato.numeroParcelas) {
            throw new Error('Não há mais parcelas a serem reajustadas neste contrato');
        }
        const indice = indices[parametros.indiceBase] || 5;
        const percentualAdicional = parametros.percentualAdicional;
        const reajusteTotal = indice + percentualAdicional;
        const valorOriginal = Number(contrato.valorTotal) / contrato.numeroParcelas;
        const valorReajustado = valorOriginal * (1 + reajusteTotal / 100);
        const dataInicial = new Date(contrato.dataInicio);
        const mesesReajuste = proximaParcelaReajuste > 0 ? proximaParcelaReajuste - 1 : 0;
        const dataReferencia = new Date(dataInicial);
        dataReferencia.setMonth(dataInicial.getMonth() + mesesReajuste);
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
        await this.prisma.contrato.update({
            where: { id: contratoId },
            data: {
                ultimoReajuste: {
                    indice: indice,
                }
            }
        });
        return reajuste;
    }
    async simularReajuste(contratoId, parametrosOverride = {}) {
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
            throw new common_1.NotFoundException(`Contrato ID ${contratoId} não encontrado`);
        }
        const parametrosBase = await this.findParametrosReajuste();
        const parametros = Object.assign(Object.assign({}, parametrosBase), parametrosOverride);
        const indices = await this.findIndicesEconomicos();
        const parcelasPagas = contrato.parcelasPagas || 0;
        const proximaParcelaReajuste = Math.ceil((parcelasPagas + 1) / parametros.intervaloParcelas) * parametros.intervaloParcelas;
        if (proximaParcelaReajuste > contrato.numeroParcelas) {
            throw new Error('Não há mais parcelas a serem reajustadas neste contrato');
        }
        const indice = indices[parametros.indiceBase] || 5;
        const percentualAdicional = parametros.percentualAdicional;
        const reajusteTotal = indice + percentualAdicional;
        const valorOriginal = Number(contrato.valorTotal) / contrato.numeroParcelas;
        const valorReajustado = valorOriginal * (1 + reajusteTotal / 100);
        const dataInicial = new Date(contrato.dataInicio);
        const mesesReajuste = proximaParcelaReajuste > 0 ? proximaParcelaReajuste - 1 : 0;
        const dataReferencia = new Date(dataInicial);
        dataReferencia.setMonth(dataInicial.getMonth() + mesesReajuste);
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
    async findHistoricoReajustes(contratoId) {
        const contrato = await this.prisma.contrato.findUnique({
            where: { id: contratoId }
        });
        if (!contrato) {
            throw new common_1.NotFoundException(`Contrato ID ${contratoId} não encontrado`);
        }
        return this.prisma.reajuste.findMany({
            where: { contratoId },
            orderBy: { dataReferencia: 'desc' }
        });
    }
    async gerarRelatorioReajustes(query) {
        const reajustes = await this.findAll(query);
        const reajustesPorContrato = {};
        for (const reajuste of reajustes) {
            const contratoId = reajuste.contratoId;
            if (!reajustesPorContrato[contratoId]) {
                reajustesPorContrato[contratoId] = [];
            }
            reajustesPorContrato[contratoId].push(reajuste);
        }
        const relatorio = Object.entries(reajustesPorContrato).map(([contratoId, reajustesContrato]) => {
            const reajustesArray = reajustesContrato;
            const contrato = reajustesArray[0].contrato;
            const cliente = contrato.cliente;
            const reajustesOrdenados = [...reajustesArray].sort((a, b) => new Date(a.dataReferencia).getTime() - new Date(b.dataReferencia).getTime());
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
};
ReajustesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReajustesService);
exports.ReajustesService = ReajustesService;
//# sourceMappingURL=reajustes.service.js.map