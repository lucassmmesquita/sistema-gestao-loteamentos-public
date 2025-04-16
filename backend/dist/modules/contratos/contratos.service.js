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
exports.ContratosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ContratosService = class ContratosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createContratoDto) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: createContratoDto.clienteId }
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente ID ${createContratoDto.clienteId} não encontrado`);
        }
        const lote = await this.prisma.lote.findUnique({
            where: { id: createContratoDto.loteId }
        });
        if (!lote) {
            throw new common_1.NotFoundException(`Lote ID ${createContratoDto.loteId} não encontrado`);
        }
        if (lote.status !== 'disponivel') {
            throw new Error(`Lote ID ${createContratoDto.loteId} não está disponível`);
        }
        const contrato = await this.prisma.contrato.create({
            data: Object.assign(Object.assign({}, createContratoDto), { dataCriacao: new Date() })
        });
        await this.prisma.lote.update({
            where: { id: createContratoDto.loteId },
            data: { status: 'reservado' }
        });
        return contrato;
    }
    async findAll(query) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Contrato ID ${id} não encontrado`);
        }
        return contrato;
    }
    async update(id, updateContratoDto) {
        await this.findOne(id);
        if (updateContratoDto.loteId) {
            const loteAtual = await this.prisma.contrato.findUnique({
                where: { id },
                select: { loteId: true }
            });
            if (loteAtual && loteAtual.loteId !== updateContratoDto.loteId) {
                const novoLote = await this.prisma.lote.findUnique({
                    where: { id: updateContratoDto.loteId }
                });
                if (!novoLote) {
                    throw new common_1.NotFoundException(`Lote ID ${updateContratoDto.loteId} não encontrado`);
                }
                if (novoLote.status !== 'disponivel') {
                    throw new Error(`Lote ID ${updateContratoDto.loteId} não está disponível`);
                }
                await this.prisma.lote.update({
                    where: { id: loteAtual.loteId },
                    data: { status: 'disponivel' }
                });
                await this.prisma.lote.update({
                    where: { id: updateContratoDto.loteId },
                    data: { status: 'reservado' }
                });
            }
        }
        return this.prisma.contrato.update({
            where: { id },
            data: updateContratoDto,
            include: {
                cliente: true,
                lote: true
            }
        });
    }
    async remove(id) {
        const contrato = await this.findOne(id);
        await this.prisma.lote.update({
            where: { id: contrato.loteId },
            data: { status: 'disponivel' }
        });
        return this.prisma.contrato.delete({
            where: { id }
        });
    }
    async getByClienteId(clienteId) {
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
    async gerarPrevia(contratoDto) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: contratoDto.clienteId }
        });
        const lote = await this.prisma.lote.findUnique({
            where: { id: contratoDto.loteId }
        });
        if (!cliente || !lote) {
            throw new common_1.NotFoundException('Cliente ou lote não encontrado');
        }
        const valorParcela = (contratoDto.valorTotal - contratoDto.valorEntrada) / contratoDto.numeroParcelas;
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
};
exports.ContratosService = ContratosService;
exports.ContratosService = ContratosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContratosService);
//# sourceMappingURL=contratos.service.js.map