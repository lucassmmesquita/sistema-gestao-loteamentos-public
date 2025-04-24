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
const path_1 = require("path");
const fs_1 = require("fs");
let DocumentosService = class DocumentosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDocumentoDto) {
        return this.prisma.documento.create({
            data: createDocumentoDto,
        });
    }
    async findAll(clienteId) {
        if (clienteId) {
            return this.prisma.documento.findMany({
                where: { clienteId },
            });
        }
        return this.prisma.documento.findMany();
    }
    async findOne(id) {
        const documento = await this.prisma.documento.findUnique({
            where: { id },
        });
        if (!documento) {
            throw new common_1.NotFoundException(`Documento ID ${id} não encontrado`);
        }
        return documento;
    }
    async update(id, updateDocumentoDto) {
        await this.findOne(id);
        return this.prisma.documento.update({
            where: { id },
            data: updateDocumentoDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.documento.delete({
            where: { id },
        });
    }
    async uploadFile(clienteId, file, tipoDocumento) {
        try {
            const cliente = await this.prisma.cliente.findUnique({
                where: { id: clienteId },
            });
            if (!cliente) {
                throw new common_1.NotFoundException(`Cliente ID ${clienteId} não encontrado`);
            }
            const baseDir = (0, path_1.join)(__dirname, '..', '..', '..', 'uploads');
            const docsDir = (0, path_1.join)(baseDir, 'documentos');
            const clienteFolderName = `${cliente.id}-${cliente.nome.replace(/[^a-zA-Z0-9]/g, '_')}`;
            const clienteDir = (0, path_1.join)(docsDir, clienteFolderName);
            if (!(0, fs_1.existsSync)(clienteDir)) {
                (0, fs_1.mkdirSync)(clienteDir, { recursive: true });
            }
            const tempFilePath = file.path;
            const fileName = (0, path_1.basename)(file.path);
            const newFilePath = (0, path_1.join)(clienteDir, fileName);
            (0, fs_1.renameSync)(tempFilePath, newFilePath);
            const filePath = newFilePath;
            return this.prisma.documento.create({
                data: {
                    clienteId,
                    tipo: tipoDocumento,
                    nome: file.originalname,
                    arquivo: filePath,
                    dataUpload: new Date(),
                },
            });
        }
        catch (error) {
            console.error('Erro ao processar upload de arquivo:', error);
            throw new Error(`Erro ao fazer upload: ${error.message}`);
        }
    }
};
DocumentosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentosService);
exports.DocumentosService = DocumentosService;
//# sourceMappingURL=documentos.service.js.map