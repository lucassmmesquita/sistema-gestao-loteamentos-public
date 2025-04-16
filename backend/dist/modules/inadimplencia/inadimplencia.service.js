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
exports.InadimplenciaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let InadimplenciaService = class InadimplenciaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listarClientesInadimplentes(query) {
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
    async obterClienteInadimplente(id) {
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
            throw new common_1.NotFoundException(`Cliente inadimplente ID ${id} não encontrado`);
        }
        return clienteInadimplente;
    }
    async registrarInteracao(clienteId, createInteracaoDto) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: clienteId }
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente ID ${clienteId} não encontrado`);
        }
        return this.prisma.interacao.create({
            data: Object.assign(Object.assign({}, createInteracaoDto), { clienteId })
        });
    }
    async obterHistoricoInteracoes(clienteId) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: clienteId }
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente ID ${clienteId} não encontrado`);
        }
        return this.prisma.interacao.findMany({
            where: { clienteId },
            orderBy: { data: 'desc' }
        });
    }
    async gerarNovoBoleto(clienteId, parcelaId) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: clienteId }
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente ID ${clienteId} não encontrado`);
        }
        const parcela = await this.prisma.parcelaInadimplente.findUnique({
            where: { id: parseInt(parcelaId) },
            include: {
                clienteInadimplente: true
            }
        });
        if (!parcela) {
            throw new common_1.NotFoundException(`Parcela ID ${parcelaId} não encontrada`);
        }
        const novoBoleto = {
            id: Math.floor(Math.random() * 1000) + 1,
            dataVencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            valor: parcela.valorAtualizado,
            status: 'gerado'
        };
        return novoBoleto;
    }
    async obterGatilhos() {
        const configuracao = await this.prisma.configuracaoGatilhos.findFirst();
        if (!configuracao) {
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
    async salvarGatilhos(configuracaoGatilhosDto) {
        const configuracao = await this.prisma.configuracaoGatilhos.findFirst();
        const gatilhosJson = JSON.parse(JSON.stringify(configuracaoGatilhosDto.gatilhos));
        if (!configuracao) {
            return this.prisma.configuracaoGatilhos.create({
                data: Object.assign(Object.assign({}, configuracaoGatilhosDto), { gatilhos: gatilhosJson })
            });
        }
        return this.prisma.configuracaoGatilhos.update({
            where: { id: configuracao.id },
            data: Object.assign(Object.assign({}, configuracaoGatilhosDto), { gatilhos: gatilhosJson })
        });
    }
    async enviarComunicacao(createComunicacaoDto) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: createComunicacaoDto.clienteId }
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente ID ${createComunicacaoDto.clienteId} não encontrado`);
        }
        return this.prisma.comunicacao.create({
            data: createComunicacaoDto
        });
    }
    async obterHistoricoComunicacoes(clienteId) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: clienteId }
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente ID ${clienteId} não encontrado`);
        }
        return this.prisma.comunicacao.findMany({
            where: { clienteId },
            orderBy: { data: 'desc' }
        });
    }
    async enviarCobrancaAutomatica(clienteId, parcelaId, gatilho) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: clienteId },
            include: {
                contatos: true
            }
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente ID ${clienteId} não encontrado`);
        }
        const parcela = await this.prisma.parcelaInadimplente.findUnique({
            where: { id: parseInt(parcelaId) }
        });
        if (!parcela) {
            throw new common_1.NotFoundException(`Parcela ID ${parcelaId} não encontrada`);
        }
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
    async exportarDados(formato, query) {
        const dados = await this.listarClientesInadimplentes(query);
        switch (formato) {
            case 'excel':
                return {
                    data: 'buffer-simulado',
                    tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    nome: `inadimplentes_${new Date().toISOString().split('T')[0]}.xlsx`
                };
            case 'pdf':
                return {
                    data: 'buffer-simulado',
                    tipo: 'application/pdf',
                    nome: `inadimplentes_${new Date().toISOString().split('T')[0]}.pdf`
                };
            default:
                throw new Error('Formato de exportação não suportado');
        }
    }
};
exports.InadimplenciaService = InadimplenciaService;
exports.InadimplenciaService = InadimplenciaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InadimplenciaService);
//# sourceMappingURL=inadimplencia.service.js.map