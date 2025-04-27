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
exports.ParcelasController = void 0;
const common_1 = require("@nestjs/common");
const parcelas_service_1 = require("./parcelas.service");
const create_parcela_dto_1 = require("./dto/create-parcela.dto");
const update_parcela_dto_1 = require("./dto/update-parcela.dto");
const pagamento_parcela_dto_1 = require("./dto/pagamento-parcela.dto");
let ParcelasController = class ParcelasController {
    constructor(parcelasService) {
        this.parcelasService = parcelasService;
    }
    create(createParcelaDto) {
        return this.parcelasService.create(createParcelaDto);
    }
    findAll() {
        return this.parcelasService.findAll();
    }
    findOne(id) {
        return this.parcelasService.findOne(id);
    }
    findByContrato(contratoId) {
        return this.parcelasService.findByContrato(contratoId);
    }
    gerarParcelas(contratoId) {
        return this.parcelasService.gerarParcelas(contratoId);
    }
    update(id, updateParcelaDto) {
        return this.parcelasService.update(id, updateParcelaDto);
    }
    registrarPagamento(id, pagamentoDto) {
        return this.parcelasService.registrarPagamento(id, pagamentoDto);
    }
    remove(id) {
        return this.parcelasService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_parcela_dto_1.CreateParcelaDto]),
    __metadata("design:returntype", void 0)
], ParcelasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ParcelasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ParcelasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('contrato/:contratoId'),
    __param(0, (0, common_1.Param)('contratoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ParcelasController.prototype, "findByContrato", null);
__decorate([
    (0, common_1.Post)('gerar/:contratoId'),
    __param(0, (0, common_1.Param)('contratoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ParcelasController.prototype, "gerarParcelas", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_parcela_dto_1.UpdateParcelaDto]),
    __metadata("design:returntype", void 0)
], ParcelasController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/pagamento'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagamento_parcela_dto_1.PagamentoParcelaDto]),
    __metadata("design:returntype", void 0)
], ParcelasController.prototype, "registrarPagamento", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ParcelasController.prototype, "remove", null);
ParcelasController = __decorate([
    (0, common_1.Controller)('parcelas'),
    __metadata("design:paramtypes", [parcelas_service_1.ParcelasService])
], ParcelasController);
exports.ParcelasController = ParcelasController;
//# sourceMappingURL=parcelas.controller.js.map