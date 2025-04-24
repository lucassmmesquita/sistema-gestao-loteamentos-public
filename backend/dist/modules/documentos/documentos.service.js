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
const fs = require("fs");
const path = require("path");
let DocumentosService = class DocumentosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id: data.clienteId },
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente com ID ${data.clienteId} não encontrado`);
        }
        console.log('Criando documento:', data);
        return this.prisma.documento.create({
            data: {
                clienteId: data.clienteId,
                tipo: data.tipo,
                nome: data.nome,
                arquivo: data.arquivo,
            },
        });
    }
    async findAll(clienteId) {
        const where = clienteId ? { clienteId } : {};
        return this.prisma.documento.findMany({
            where,
            orderBy: { dataUpload: 'desc' },
        });
    }
    async findOne(id) {
        const documento = await this.prisma.documento.findUnique({
            where: { id },
        });
        if (!documento) {
            throw new common_1.NotFoundException(`Documento com ID ${id} não encontrado`);
        }
        return documento;
    }
    async remove(id) {
        const documento = await this.findOne(id);
        try {
            const filePath = path.join(process.cwd(), documento.arquivo.replace(/^\/uploads/, 'uploads'));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        catch (error) {
            console.error('Erro ao excluir arquivo:', error);
        }
        return this.prisma.documento.delete({
            where: { id },
        });
    }
};
DocumentosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentosService);
exports.DocumentosService = DocumentosService;
//# sourceMappingURL=documentos.service.js.map