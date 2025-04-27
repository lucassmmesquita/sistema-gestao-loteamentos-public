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
exports.ParcelasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const date_fns_1 = require("date-fns");
let ParcelasService = class ParcelasService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createParcelaDto) {
        const contrato = await this.prisma.contrato.findUnique({
            where: { id: createParcelaDto.contratoId }
        });
        if (!contrato) {
            throw new common_1.NotFoundException(`Contrato ID ${createParcelaDto.contratoId} não encontrado`);
        }
        return this.prisma.parcela.create({
            data: Object.assign(Object.assign({}, createParcelaDto), { status: createParcelaDto.status || 'futura' })
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
    async findOne(id) {
        const parcela = await this.prisma.parcela.findUnique({
            where: { id },
            include: {
                contrato: true,
                boleto: true
            }
        });
        if (!parcela) {
            throw new common_1.NotFoundException(`Parcela ID ${id} não encontrada`);
        }
        return parcela;
    }
    async findByContrato(contratoId) {
        const contrato = await this.prisma.contrato.findUnique({
            where: { id: contratoId }
        });
        if (!contrato) {
            throw new common_1.NotFoundException(`Contrato ID ${contratoId} não encontrado`);
        }
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
    async gerarParcelas(contratoId) {
        const contrato = await this.prisma.contrato.findUnique({
            where: { id: contratoId }
        });
        if (!contrato) {
            throw new common_1.NotFoundException(`Contrato ID ${contratoId} não encontrado`);
        }
        const parcelasExistentes = await this.prisma.parcela.findMany({
            where: { contratoId }
        });
        if (parcelasExistentes.length > 0) {
            throw new Error('Já existem parcelas geradas para este contrato');
        }
        const valorTotal = Number(contrato.valorTotal);
        const valorEntrada = Number(contrato.valorEntrada);
        const valorFinanciado = valorTotal - valorEntrada;
        const valorParcela = valorFinanciado / contrato.numeroParcelas;
        let dataBase;
        if (contrato.dataPrimeiraPrestacao) {
            dataBase = new Date(contrato.dataPrimeiraPrestacao);
        }
        else {
            dataBase = new Date();
            dataBase.setDate(contrato.dataVencimento);
            if (dataBase.getDate() > contrato.dataVencimento) {
                dataBase = (0, date_fns_1.addMonths)(dataBase, 1);
            }
        }
        const parcelas = [];
        for (let i = 1; i <= contrato.numeroParcelas; i++) {
            const dataVencimento = new Date(dataBase);
            if (i > 1) {
                dataVencimento.setMonth(dataBase.getMonth() + (i - 1));
            }
            let status = 'futura';
            const hoje = new Date();
            if (dataVencimento < hoje) {
                status = 'atrasada';
            }
            else if (Math.floor((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)) <= 7) {
                status = 'vencendo';
            }
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
    async update(id, updateParcelaDto) {
        await this.findOne(id);
        return this.prisma.parcela.update({
            where: { id },
            data: updateParcelaDto
        });
    }
    async registrarPagamento(id, pagamentoDto) {
        const parcela = await this.findOne(id);
        if (parcela.dataPagamento) {
            throw new Error('Esta parcela já está paga');
        }
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
        await this.prisma.contrato.update({
            where: { id: parcela.contratoId },
            data: {
                parcelasPagas: {
                    increment: 1
                }
            }
        });
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
    async remove(id) {
        await this.findOne(id);
        return this.prisma.parcela.delete({
            where: { id }
        });
    }
};
ParcelasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ParcelasService);
exports.ParcelasService = ParcelasService;
//# sourceMappingURL=parcelas.service.js.map