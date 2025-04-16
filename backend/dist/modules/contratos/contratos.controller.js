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
exports.ContratosController = void 0;
const common_1 = require("@nestjs/common");
const contratos_service_1 = require("./contratos.service");
const create_contrato_dto_1 = require("./dto/create-contrato.dto");
const update_contrato_dto_1 = require("./dto/update-contrato.dto");
const query_contrato_dto_1 = require("./dto/query-contrato.dto");
let ContratosController = class ContratosController {
    constructor(contratosService) {
        this.contratosService = contratosService;
    }
    create(createContratoDto) {
        return this.contratosService.create(createContratoDto);
    }
    findAll(query) {
        return this.contratosService.findAll(query);
    }
    findOne(id) {
        return this.contratosService.findOne(id);
    }
    update(id, updateContratoDto) {
        return this.contratosService.update(id, updateContratoDto);
    }
    remove(id) {
        return this.contratosService.remove(id);
    }
    getByClienteId(clienteId) {
        return this.contratosService.getByClienteId(clienteId);
    }
    getLotesDisponiveis() {
        return this.contratosService.getLotesDisponiveis();
    }
    gerarPrevia(contratoDto) {
        return this.contratosService.gerarPrevia(contratoDto);
    }
};
exports.ContratosController = ContratosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contrato_dto_1.CreateContratoDto]),
    __metadata("design:returntype", void 0)
], ContratosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_contrato_dto_1.QueryContratoDto]),
    __metadata("design:returntype", void 0)
], ContratosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContratosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_contrato_dto_1.UpdateContratoDto]),
    __metadata("design:returntype", void 0)
], ContratosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContratosController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('cliente/:clienteId'),
    __param(0, (0, common_1.Param)('clienteId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ContratosController.prototype, "getByClienteId", null);
__decorate([
    (0, common_1.Get)('lotes/disponiveis'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContratosController.prototype, "getLotesDisponiveis", null);
__decorate([
    (0, common_1.Post)('previa'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contrato_dto_1.CreateContratoDto]),
    __metadata("design:returntype", void 0)
], ContratosController.prototype, "gerarPrevia", null);
exports.ContratosController = ContratosController = __decorate([
    (0, common_1.Controller)('contratos'),
    __metadata("design:paramtypes", [contratos_service_1.ContratosService])
], ContratosController);
//# sourceMappingURL=contratos.controller.js.map