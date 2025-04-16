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
exports.DocumentosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DocumentosService = class DocumentosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAditivo(createAditivoDto) {
        const contrato = await this.prisma.contrato.findUnique({
            where: { id: createAditivoDto.contratoId }
        });
        if (!contrato) {
            throw new common_1.NotFoundException(`Contrato ID ${createAditivoDto.contratoId} não encontrado`);
        }
        return this.prisma.aditivo.create({
            data: createAditivoDto
        });
    }
    async findAllAditivos(contratoId = null) {
        const where = contratoId ? { contratoId } : {};
        return this.prisma.aditivo.findMany({
            where,
            include: {
                contrato: {
                    select: {
                        id: true,
                        clienteId: true,
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
    }
    async findOneAditivo(id) {
        const aditivo = await this.prisma.aditivo.findUnique({
            where: { id },
            include: {
                contrato: {
                    include: {
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
        if (!aditivo) {
            throw new common_1.NotFoundException(`Aditivo ID ${id} não encontrado`);
        }
        return aditivo;
    }
    async updateAditivo(id, updateAditivoDto) {
        await this.findOneAditivo(id);
        return this.prisma.aditivo.update({
            where: { id },
            data: updateAditivoDto
        });
    }
    async removeAditivo(id) {
        await this.findOneAditivo(id);
        return this.prisma.aditivo.delete({
            where: { id }
        });
    }
    async createDistrato(createDistratoDto) {
        const contrato = await this.prisma.contrato.findUnique({
            where: { id: createDistratoDto.contratoId }
        });
        if (!contrato) {
            throw new common_1.NotFoundException(`Contrato ID ${createDistratoDto.contratoId} não encontrado`);
        }
        return this.prisma.distrato.create({
            data: createDistratoDto
        });
    }
    async findAllDistratos(contratoId = null) {
        const where = contratoId ? { contratoId } : {};
        return this.prisma.distrato.findMany({
            where,
            include: {
                contrato: {
                    select: {
                        id: true,
                        clienteId: true,
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
    }
    async findOneDistrato(id) {
        const distrato = await this.prisma.distrato.findUnique({
            where: { id },
            include: {
                contrato: {
                    include: {
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
        if (!distrato) {
            throw new common_1.NotFoundException(`Distrato ID ${id} não encontrado`);
        }
        return distrato;
    }
    async updateDistrato(id, updateDistratoDto) {
        await this.findOneDistrato(id);
        return this.prisma.distrato.update({
            where: { id },
            data: updateDistratoDto
        });
    }
    async removeDistrato(id) {
        await this.findOneDistrato(id);
        return this.prisma.distrato.delete({
            where: { id }
        });
    }
    async createQuitacao(createQuitacaoDto) {
        const contrato = await this.prisma.contrato.findUnique({
            where: { id: createQuitacaoDto.contratoId }
        });
        if (!contrato) {
            throw new common_1.NotFoundException(`Contrato ID ${createQuitacaoDto.contratoId} não encontrado`);
        }
        const quitacaoExistente = await this.prisma.quitacao.findFirst({
            where: { contratoId: createQuitacaoDto.contratoId }
        });
        if (quitacaoExistente) {
            throw new Error(`Já existe uma quitação para o contrato ID ${createQuitacaoDto.contratoId}`);
        }
        const quitacao = await this.prisma.quitacao.create({
            data: createQuitacaoDto
        });
        await this.prisma.contrato.update({
            where: { id: createQuitacaoDto.contratoId },
            data: { status: 'quitado' }
        });
        return quitacao;
    }
    async findAllQuitacoes(contratoId = null) {
        const where = contratoId ? { contratoId } : {};
        return this.prisma.quitacao.findMany({
            where,
            include: {
                contrato: {
                    select: {
                        id: true,
                        clienteId: true,
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
    }
    async findOneQuitacao(id) {
        const quitacao = await this.prisma.quitacao.findUnique({
            where: { id },
            include: {
                contrato: {
                    include: {
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
        if (!quitacao) {
            throw new common_1.NotFoundException(`Quitação ID ${id} não encontrada`);
        }
        return quitacao;
    }
    async updateQuitacao(id, updateQuitacaoDto) {
        await this.findOneQuitacao(id);
        return this.prisma.quitacao.update({
            where: { id },
            data: updateQuitacaoDto
        });
    }
    async removeQuitacao(id) {
        const quitacao = await this.findOneQuitacao(id);
        await this.prisma.contrato.update({
            where: { id: quitacao.contratoId },
            data: { status: 'ativo' }
        });
        return this.prisma.quitacao.delete({
            where: { id }
        });
    }
    async createDocumento(createDocumentoDto) {
        const contrato = await this.prisma.contrato.findUnique({
            where: { id: createDocumentoDto.contratoId }
        });
        if (!contrato) {
            throw new common_1.NotFoundException(`Contrato ID ${createDocumentoDto.contratoId} não encontrado`);
        }
        return this.prisma.documento.create({
            data: {
                clienteId: contrato.clienteId,
                tipo: createDocumentoDto.tipo,
                nome: createDocumentoDto.nome,
                arquivo: createDocumentoDto.arquivo
            }
        });
    }
    async uploadDocumento(contratoId, tipo, file) {
        const contrato = await this.prisma.contrato.findUnique({
            where: { id: contratoId }
        });
        if (!contrato) {
            throw new common_1.NotFoundException(`Contrato ID ${contratoId} não encontrado`);
        }
        const arquivo = `uploads/${new Date().getTime()}_${file.originalname}`;
        return this.prisma.documento.create({
            data: {
                clienteId: contrato.clienteId,
                tipo,
                nome: file.originalname,
                arquivo
            }
        });
    }
    async findAllDocumentos(contratoId = null) {
        let where = {};
        if (contratoId) {
            const contrato = await this.prisma.contrato.findUnique({
                where: { id: contratoId }
            });
            if (contrato) {
                where = { clienteId: contrato.clienteId };
            }
        }
        return this.prisma.documento.findMany({
            where,
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
    }
    async findOneDocumento(id) {
        const documento = await this.prisma.documento.findUnique({
            where: { id },
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
        if (!documento) {
            throw new common_1.NotFoundException(`Documento ID ${id} não encontrado`);
        }
        return documento;
    }
    async updateDocumento(id, updateDocumentoDto) {
        await this.findOneDocumento(id);
        return this.prisma.documento.update({
            where: { id },
            data: updateDocumentoDto
        });
    }
    async removeDocumento(id) {
        await this.findOneDocumento(id);
        return this.prisma.documento.delete({
            where: { id }
        });
    }
};
exports.DocumentosService = DocumentosService;
exports.DocumentosService = DocumentosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentosService);
//# sourceMappingURL=documentos.service.js.map