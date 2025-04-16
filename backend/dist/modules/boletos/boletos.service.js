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
exports.BoletosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BoletosService = class BoletosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async gerarBoleto(createBoletoDto) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: createBoletoDto.clienteId }
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente ID ${createBoletoDto.clienteId} não encontrado`);
        }
        const contrato = await this.prisma.contrato.findUnique({
            where: { id: createBoletoDto.contratoId }
        });
        if (!contrato) {
            throw new common_1.NotFoundException(`Contrato ID ${createBoletoDto.contratoId} não encontrado`);
        }
        const nossoNumero = createBoletoDto.nossoNumero || this.gerarNossoNumero();
        const linhaDigitavel = createBoletoDto.linhaDigitavel || this.gerarLinhaDigitavel(nossoNumero);
        const codigoBarras = createBoletoDto.codigoBarras || this.gerarCodigoBarras(nossoNumero);
        const pdfUrl = createBoletoDto.pdfUrl || `https://api.sistema.com/boletos/${nossoNumero}/pdf`;
        const boleto = await this.prisma.boleto.create({
            data: Object.assign(Object.assign({}, createBoletoDto), { nossoNumero,
                linhaDigitavel,
                codigoBarras,
                pdfUrl, dataGeracao: new Date(), status: 'gerado' })
        });
        return boleto;
    }
    async findAll(query) {
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
    async findOne(id) {
        const boleto = await this.prisma.boleto.findUnique({
            where: { id },
            include: {
                cliente: true,
                contrato: true
            }
        });
        if (!boleto) {
            throw new common_1.NotFoundException(`Boleto ID ${id} não encontrado`);
        }
        return boleto;
    }
    async cancel(id) {
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
    async registrarPagamento(id, dadosPagamento) {
        const boleto = await this.findOne(id);
        if (boleto.status === 'cancelado') {
            throw new Error('Não é possível registrar pagamento de um boleto cancelado');
        }
        if (boleto.status === 'pago') {
            throw new Error('Boleto já está pago');
        }
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
    gerarNossoNumero() {
        return Math.floor(10000000000 + Math.random() * 90000000000).toString();
    }
    gerarLinhaDigitavel(nossoNumero) {
        const parte1 = nossoNumero.substring(0, 5);
        const parte2 = nossoNumero.substring(5, 10);
        const parte3 = nossoNumero.substring(10, 11);
        const parte4 = Math.floor(1000 + Math.random() * 9000).toString();
        return `10492.${parte1}.${parte2}.${parte3}.${parte4}`;
    }
    gerarCodigoBarras(nossoNumero) {
        return `104${Math.floor(10000000000000000000000000000000000000000 + Math.random() * 90000000000000000000000000000000000000000).toString()}`;
    }
};
exports.BoletosService = BoletosService;
exports.BoletosService = BoletosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BoletosService);
//# sourceMappingURL=boletos.service.js.map