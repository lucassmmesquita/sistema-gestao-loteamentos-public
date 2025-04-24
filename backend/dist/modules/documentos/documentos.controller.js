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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const documentos_service_1 = require("./documentos.service");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const fs = require("fs");
const path = require("path");
let DocumentosController = class DocumentosController {
    constructor(documentosService) {
        this.documentosService = documentosService;
    }
    async create(createDocumentoDto) {
        return this.documentosService.create(createDocumentoDto);
    }
    async findAll(clienteId) {
        return this.documentosService.findAll(clienteId ? parseInt(clienteId) : undefined);
    }
    async findOne(id) {
        return this.documentosService.findOne(id);
    }
    async remove(id) {
        return this.documentosService.remove(id);
    }
    async upload(file, clienteId, tipoDocumento) {
        if (!file) {
            throw new common_1.BadRequestException('Arquivo não fornecido');
        }
        if (!tipoDocumento) {
            throw new common_1.BadRequestException('Tipo de documento não fornecido');
        }
        console.log('Upload recebido:', {
            clienteId,
            tipoDocumento,
            file: {
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: file.path
            }
        });
        return this.documentosService.create({
            clienteId,
            tipo: tipoDocumento,
            nome: file.originalname,
            arquivo: file.path.replace(/\\/g, '/').replace(`${process.cwd().replace(/\\/g, '/')}/uploads`, '/uploads'),
        });
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('clienteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('upload/:clienteId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const clienteId = req.params.clienteId;
                const tipoDocumento = req.body.tipoDocumento;
                const uploadPath = path.join(process.cwd(), 'uploads', 'documentos', clienteId, tipoDocumento);
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = (0, uuid_1.v4)();
                const fileExt = (0, path_1.extname)(file.originalname);
                cb(null, `${uniqueSuffix}${fileExt}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('clienteId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)('tipoDocumento')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "upload", null);
DocumentosController = __decorate([
    (0, common_1.Controller)('documentos'),
    __metadata("design:paramtypes", [documentos_service_1.DocumentosService])
], DocumentosController);
exports.DocumentosController = DocumentosController;
//# sourceMappingURL=documentos.controller.js.map