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
const uuid_1 = require("uuid");
let InadimplenciaService = class InadimplenciaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listarClientesInadimplentes(query) {
        const filtros = {};
        if (query.statusPagamento) {
            filtros.status = query.statusPagamento;
        }
        if (query.contratoId) {
            filtros.contratoId = parseInt(query.contratoId);
        }
        if (query.valorMinimo) {
            filtros.valorEmAberto = {
                gte: parseFloat(query.valorMinimo),
            };
        }
        if (query.valorMaximo) {
            filtros.valorEmAberto = Object.assign(Object.assign({}, (filtros.valorEmAberto || {})), { lte: parseFloat(query.valorMaximo) });
        }
        if (query.diasAtrasoMin) {
            filtros.diasAtraso = {
                gte: parseInt(query.diasAtrasoMin),
            };
        }
        if (query.diasAtrasoMax) {
            filtros.diasAtraso = Object.assign(Object.assign({}, (filtros.diasAtraso || {})), { lte: parseInt(query.diasAtrasoMax) });
        }
        const clientesInadimplentes = await this.prisma.clienteInadimplente.findMany({
            where: filtros,
            include: {
                cliente: true,
                parcelas: true,
            },
        });
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
    async obterClienteInadimplente(id) {
        const clienteInadimplente = await this.prisma.clienteInadimplente.findUnique({
            where: { id },
            include: {
                cliente: true,
                parcelas: true,
            },
        });
        if (!clienteInadimplente) {
            throw new common_1.NotFoundException(`Cliente inadimplente ID ${id} não encontrado`);
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
    async obterHistoricoInteracoes(clienteId) {
        const interacoes = await this.prisma.interacao.findMany({
            where: { clienteId },
            orderBy: { data: 'desc' },
        });
        return interacoes;
    }
    async registrarInteracao(clienteId, dados) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: clienteId },
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente ID ${clienteId} não encontrado`);
        }
        return this.prisma.interacao.create({
            data: {
                id: (0, uuid_1.v4)(),
                clienteId,
                tipo: dados.tipo,
                data: new Date(),
                observacao: dados.observacao,
                usuario: dados.usuario,
                parcelaId: dados.parcelaId,
            },
        });
    }
    async obterHistoricoComunicacoes(clienteId) {
        const comunicacoes = await this.prisma.comunicacao.findMany({
            where: { clienteId },
            orderBy: { data: 'desc' },
        });
        return comunicacoes;
    }
    async enviarComunicacao(dados) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: dados.clienteId },
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente ID ${dados.clienteId} não encontrado`);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const comunicacao = await this.prisma.comunicacao.create({
            data: {
                id: (0, uuid_1.v4)(),
                clienteId: dados.clienteId,
                tipo: dados.tipo,
                data: new Date(),
                mensagem: dados.mensagem,
                status: 'enviado',
                anexos: dados.anexos ? { anexos: dados.anexos } : undefined,
            },
        });
        await this.prisma.clienteInadimplente.updateMany({
            where: { clienteId: dados.clienteId },
            data: { ultimaCobranca: new Date() },
        });
        return comunicacao;
    }
    async gerarNovoBoleto(clienteId, parcelaId, dados) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: clienteId },
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente ID ${clienteId} não encontrado`);
        }
        const parcela = await this.prisma.parcelaInadimplente.findUnique({
            where: { id: parcelaId },
        });
        if (!parcela) {
            throw new common_1.NotFoundException(`Parcela ID ${parcelaId} não encontrada`);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const boleto = {
            id: Date.now(),
            clienteId,
            clienteNome: cliente.nome,
            contratoId: parcela.clienteInadimplente_id,
            valor: parcela.valorAtualizado,
            dataVencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            numeroParcela: parcela.numero,
            descricao: `Nova emissão - Parcela ${parcela.numero}`,
            nossoNumero: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
            linhaDigitavel: `${Date.now()}${Math.floor(Math.random() * 10000)}`,
            codigoBarras: `${Date.now()}${Math.floor(Math.random() * 100000)}`,
            pdfUrl: `/uploads/boletos/boleto_${Date.now()}.pdf`,
            dataGeracao: new Date(),
            status: 'gerado',
        };
        return this.prisma.boleto.create({
            data: boleto,
        });
    }
    async obterGatilhos() {
        let configuracao = await this.prisma.configuracaoGatilhos.findFirst();
        if (!configuracao) {
            configuracao = await this.prisma.configuracaoGatilhos.create({
                data: {
                    executarAutomaticamente: true,
                    horarioExecucao: '08:00',
                    diasExecucao: ['1', '3', '5'],
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
    async salvarGatilhos(dados) {
        const configuracaoExistente = await this.prisma.configuracaoGatilhos.findFirst();
        if (configuracaoExistente) {
            return this.prisma.configuracaoGatilhos.update({
                where: { id: configuracaoExistente.id },
                data: {
                    gatilhos: dados.gatilhos,
                },
            });
        }
        else {
            return this.prisma.configuracaoGatilhos.create({
                data: {
                    executarAutomaticamente: true,
                    horarioExecucao: '08:00',
                    diasExecucao: ['1', '3', '5'],
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
    async enviarCobrancaAutomatica(dados) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: dados.clienteId },
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente ID ${dados.clienteId} não encontrado`);
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
        const comunicacao = await this.prisma.comunicacao.create({
            data: {
                id: (0, uuid_1.v4)(),
                clienteId: dados.clienteId,
                tipo: dados.gatilho.tipo,
                data: new Date(),
                mensagem: dados.gatilho.mensagem,
                status: 'enviado',
                parcelaInfo: { parcelaId: dados.parcelaId },
            },
        });
        await this.prisma.clienteInadimplente.updateMany({
            where: { clienteId: dados.clienteId },
            data: { ultimaCobranca: new Date() },
        });
        return comunicacao;
    }
    async exportarDados(formato, filtros) {
        const clientesInadimplentes = await this.listarClientesInadimplentes(filtros);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
            dados: clientesInadimplentes,
            formato,
            dataGeracao: new Date(),
        };
    }
};
InadimplenciaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InadimplenciaService);
exports.InadimplenciaService = InadimplenciaService;
//# sourceMappingURL=inadimplencia.service.js.map