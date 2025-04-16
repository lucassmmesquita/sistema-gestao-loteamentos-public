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
        try {
            const hoje = new Date();
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
            const clientesMap = new Map();
            for (const boleto of boletosVencidos) {
                const clienteId = boleto.clienteId;
                const contratoId = boleto.contratoId;
                const dataVencimento = boleto.dataVencimento;
                const diffTime = Math.abs(hoje.getTime() - dataVencimento.getTime());
                const diasAtraso = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const key = `${clienteId}-${contratoId}`;
                if (!clientesMap.has(key)) {
                    clientesMap.set(key, {
                        id: clienteId,
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
                clienteInfo.valorEmAberto += Number(boleto.valor);
                if (diasAtraso > clienteInfo.diasAtraso) {
                    clienteInfo.diasAtraso = diasAtraso;
                }
                clienteInfo.parcelas.push({
                    id: boleto.id,
                    numero: boleto.numeroParcela,
                    dataVencimento: boleto.dataVencimento,
                    valor: Number(boleto.valor),
                    valorAtualizado: Number(boleto.valor),
                    status: 'vencido'
                });
            }
            let clientesInadimplentes = Array.from(clientesMap.values());
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
            clientesInadimplentes.sort((a, b) => b.diasAtraso - a.diasAtraso);
            return clientesInadimplentes;
        }
        catch (error) {
            console.error('Erro ao listar clientes inadimplentes:', error);
            throw new common_1.InternalServerErrorException('Erro ao listar clientes inadimplentes: ' + error.message);
        }
    }
    async obterClienteInadimplente(id) {
        try {
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
                throw new common_1.NotFoundException(`Boleto ID ${id} não encontrado`);
            }
            const hoje = new Date();
            const dataVencimento = boleto.dataVencimento;
            const diffTime = Math.abs(hoje.getTime() - dataVencimento.getTime());
            const diasAtraso = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
        }
        catch (error) {
            console.error(`Erro ao obter cliente inadimplente ${id}:`, error);
            throw new common_1.InternalServerErrorException(`Erro ao obter cliente inadimplente: ${error.message}`);
        }
    }
    async registrarInteracao(clienteId, createInteracaoDto) {
        try {
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
        catch (error) {
            console.error(`Erro ao registrar interação para cliente ${clienteId}:`, error);
            throw new common_1.InternalServerErrorException(`Erro ao registrar interação: ${error.message}`);
        }
    }
    async obterHistoricoInteracoes(clienteId) {
        try {
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
        catch (error) {
            console.error(`Erro ao obter histórico de interações para cliente ${clienteId}:`, error);
            throw new common_1.InternalServerErrorException(`Erro ao obter histórico de interações: ${error.message}`);
        }
    }
    async gerarNovoBoleto(clienteId, parcelaId) {
        try {
            const cliente = await this.prisma.cliente.findUnique({
                where: { id: clienteId }
            });
            if (!cliente) {
                throw new common_1.NotFoundException(`Cliente ID ${clienteId} não encontrado`);
            }
            const boleto = await this.prisma.boleto.findUnique({
                where: { id: parseInt(parcelaId) }
            });
            if (!boleto) {
                throw new common_1.NotFoundException(`Parcela ID ${parcelaId} não encontrada`);
            }
            const hoje = new Date();
            const novaDataVencimento = new Date(hoje);
            novaDataVencimento.setDate(hoje.getDate() + 7);
            const nossoNumero = Math.floor(10000000000 + Math.random() * 90000000000).toString();
            const linhaDigitavel = `10492.${nossoNumero.substring(0, 5)}.${nossoNumero.substring(5, 10)}.${nossoNumero.substring(10, 11)}.${Math.floor(1000 + Math.random() * 9000)}`;
            const codigoBarras = `104${Math.floor(10000000000000000000000000000000000000000 + Math.random() * 90000000000000000000000000000000000000000).toString()}`;
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
        }
        catch (error) {
            console.error(`Erro ao gerar novo boleto para cliente ${clienteId}:`, error);
            throw new common_1.InternalServerErrorException(`Erro ao gerar novo boleto: ${error.message}`);
        }
    }
    async obterGatilhos() {
        try {
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
            return Object.assign(Object.assign({}, configuracao), { gatilhos: configuracao.gatilhos ? JSON.parse(JSON.stringify(configuracao.gatilhos)) : [] });
        }
        catch (error) {
            console.error('Erro ao obter configurações de gatilhos:', error);
            throw new common_1.InternalServerErrorException(`Erro ao obter configurações de gatilhos: ${error.message}`);
        }
    }
    async salvarGatilhos(configuracaoGatilhosDto) {
        try {
            const configuracao = await this.prisma.configuracaoGatilhos.findFirst();
            const gatilhosJson = JSON.parse(JSON.stringify(configuracaoGatilhosDto.gatilhos));
            if (!configuracao) {
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
        }
        catch (error) {
            console.error('Erro ao salvar configurações de gatilhos:', error);
            throw new common_1.InternalServerErrorException(`Erro ao salvar configurações de gatilhos: ${error.message}`);
        }
    }
    async enviarComunicacao(createComunicacaoDto) {
        try {
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
        catch (error) {
            console.error(`Erro ao enviar comunicação para cliente ${createComunicacaoDto.clienteId}:`, error);
            throw new common_1.InternalServerErrorException(`Erro ao enviar comunicação: ${error.message}`);
        }
    }
    async obterHistoricoComunicacoes(clienteId) {
        try {
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
        catch (error) {
            console.error(`Erro ao obter histórico de comunicações para cliente ${clienteId}:`, error);
            throw new common_1.InternalServerErrorException(`Erro ao obter histórico de comunicações: ${error.message}`);
        }
    }
    async enviarCobrancaAutomatica(clienteId, parcelaId, gatilho) {
        try {
            const cliente = await this.prisma.cliente.findUnique({
                where: { id: clienteId },
                include: {
                    contatos: true
                }
            });
            if (!cliente) {
                throw new common_1.NotFoundException(`Cliente ID ${clienteId} não encontrado`);
            }
            const boleto = await this.prisma.boleto.findUnique({
                where: { id: parseInt(parcelaId) }
            });
            if (!boleto) {
                throw new common_1.NotFoundException(`Parcela/Boleto ID ${parcelaId} não encontrado`);
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
                        valor: boleto.valor,
                        dataVencimento: boleto.dataVencimento
                    }
                }
            });
            return comunicacao;
        }
        catch (error) {
            console.error(`Erro ao enviar cobrança automática para cliente ${clienteId}:`, error);
            throw new common_1.InternalServerErrorException(`Erro ao enviar cobrança automática: ${error.message}`);
        }
    }
    async exportarDados(formato, query) {
        try {
            const dados = await this.listarClientesInadimplentes(query);
            switch (formato) {
                case 'excel':
                    return {
                        data: Buffer.from('Simulação de arquivo Excel'),
                        tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        nome: `inadimplentes_${new Date().toISOString().split('T')[0]}.xlsx`
                    };
                case 'pdf':
                    return {
                        data: Buffer.from('Simulação de arquivo PDF'),
                        tipo: 'application/pdf',
                        nome: `inadimplentes_${new Date().toISOString().split('T')[0]}.pdf`
                    };
                default:
                    throw new Error('Formato de exportação não suportado');
            }
        }
        catch (error) {
            console.error(`Erro ao exportar dados em formato ${formato}:`, error);
            throw new common_1.InternalServerErrorException(`Erro ao exportar dados: ${error.message}`);
        }
    }
};
exports.InadimplenciaService = InadimplenciaService;
exports.InadimplenciaService = InadimplenciaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InadimplenciaService);
//# sourceMappingURL=inadimplencia.service.js.map