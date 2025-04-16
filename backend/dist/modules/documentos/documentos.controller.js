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
const create_aditivo_dto_1 = require("./dto/create-aditivo.dto");
const update_aditivo_dto_1 = require("./dto/update-aditivo.dto");
const create_distrato_dto_1 = require("./dto/create-distrato.dto");
const update_distrato_dto_1 = require("./dto/update-distrato.dto");
const create_quitacao_dto_1 = require("./dto/create-quitacao.dto");
const update_quitacao_dto_1 = require("./dto/update-quitacao.dto");
const create_documento_dto_1 = require("./dto/create-documento.dto");
const update_documento_dto_1 = require("./dto/update-documento.dto");
let DocumentosController = class DocumentosController {
    constructor(documentosService) {
        this.documentosService = documentosService;
    }
    createAditivo(createAditivoDto) {
        return this.documentosService.createAditivo(createAditivoDto);
    }
    findAllAditivos(contratoId) {
        return this.documentosService.findAllAditivos(contratoId ? parseInt(contratoId) : null);
    }
    findOneAditivo(id) {
        return this.documentosService.findOneAditivo(id);
    }
    updateAditivo(id, updateAditivoDto) {
        return this.documentosService.updateAditivo(id, updateAditivoDto);
    }
    removeAditivo(id) {
        return this.documentosService.removeAditivo(id);
    }
    createDistrato(createDistratoDto) {
        return this.documentosService.createDistrato(createDistratoDto);
    }
    findAllDistratos(contratoId) {
        return this.documentosService.findAllDistratos(contratoId ? parseInt(contratoId) : null);
    }
    findOneDistrato(id) {
        return this.documentosService.findOneDistrato(id);
    }
    updateDistrato(id, updateDistratoDto) {
        return this.documentosService.updateDistrato(id, updateDistratoDto);
    }
    removeDistrato(id) {
        return this.documentosService.removeDistrato(id);
    }
    createQuitacao(createQuitacaoDto) {
        return this.documentosService.createQuitacao(createQuitacaoDto);
    }
    findAllQuitacoes(contratoId) {
        return this.documentosService.findAllQuitacoes(contratoId ? parseInt(contratoId) : null);
    }
    findOneQuitacao(id) {
        return this.documentosService.findOneQuitacao(id);
    }
    updateQuitacao(id, updateQuitacaoDto) {
        return this.documentosService.updateQuitacao(id, updateQuitacaoDto);
    }
    removeQuitacao(id) {
        return this.documentosService.removeQuitacao(id);
    }
    createDocumento(createDocumentoDto) {
        return this.documentosService.createDocumento(createDocumentoDto);
    }
    uploadDocumento(data, file) {
        return this.documentosService.uploadDocumento(parseInt(data.contratoId), data.tipo, file);
    }
    findAllDocumentos(contratoId) {
        return this.documentosService.findAllDocumentos(contratoId ? parseInt(contratoId) : null);
    }
    findOneDocumento(id) {
        return this.documentosService.findOneDocumento(id);
    }
    async downloadDocumento(id, res) {
        const documento = await this.documentosService.findOneDocumento(id);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename=${documento.nome}`);
        res.send({ message: 'Arquivo simulado' });
    }
    updateDocumento(id, updateDocumentoDto) {
        return this.documentosService.updateDocumento(id, updateDocumentoDto);
    }
    removeDocumento(id) {
        return this.documentosService.removeDocumento(id);
    }
};
exports.DocumentosController = DocumentosController;
__decorate([
    (0, common_1.Post)('aditivos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_aditivo_dto_1.CreateAditivoDto]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "createAditivo", null);
__decorate([
    (0, common_1.Get)('aditivos'),
    __param(0, (0, common_1.Query)('contratoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "findAllAditivos", null);
__decorate([
    (0, common_1.Get)('aditivos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "findOneAditivo", null);
__decorate([
    (0, common_1.Patch)('aditivos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_aditivo_dto_1.UpdateAditivoDto]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "updateAditivo", null);
__decorate([
    (0, common_1.Delete)('aditivos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "removeAditivo", null);
__decorate([
    (0, common_1.Post)('distratos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_distrato_dto_1.CreateDistratoDto]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "createDistrato", null);
__decorate([
    (0, common_1.Get)('distratos'),
    __param(0, (0, common_1.Query)('contratoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "findAllDistratos", null);
__decorate([
    (0, common_1.Get)('distratos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "findOneDistrato", null);
__decorate([
    (0, common_1.Patch)('distratos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_distrato_dto_1.UpdateDistratoDto]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "updateDistrato", null);
__decorate([
    (0, common_1.Delete)('distratos/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "removeDistrato", null);
__decorate([
    (0, common_1.Post)('quitacoes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_quitacao_dto_1.CreateQuitacaoDto]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "createQuitacao", null);
__decorate([
    (0, common_1.Get)('quitacoes'),
    __param(0, (0, common_1.Query)('contratoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "findAllQuitacoes", null);
__decorate([
    (0, common_1.Get)('quitacoes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "findOneQuitacao", null);
__decorate([
    (0, common_1.Patch)('quitacoes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_quitacao_dto_1.UpdateQuitacaoDto]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "updateQuitacao", null);
__decorate([
    (0, common_1.Delete)('quitacoes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "removeQuitacao", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_documento_dto_1.CreateDocumentoDto]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "createDocumento", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "uploadDocumento", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('contratoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "findAllDocumentos", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "findOneDocumento", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DocumentosController.prototype, "downloadDocumento", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_documento_dto_1.UpdateDocumentoDto]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "updateDocumento", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DocumentosController.prototype, "removeDocumento", null);
exports.DocumentosController = DocumentosController = __decorate([
    (0, common_1.Controller)('documentos'),
    __metadata("design:paramtypes", [documentos_service_1.DocumentosService])
], DocumentosController);
//# sourceMappingURL=documentos.controller.js.map