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
exports.LotesController = void 0;
const common_1 = require("@nestjs/common");
const lotes_service_1 = require("./lotes.service");
const create_lote_dto_1 = require("./dto/create-lote.dto");
const update_lote_dto_1 = require("./dto/update-lote.dto");
const query_lote_dto_1 = require("./dto/query-lote.dto");
let LotesController = class LotesController {
    constructor(lotesService) {
        this.lotesService = lotesService;
    }
    create(createLoteDto) {
        return this.lotesService.create(createLoteDto);
    }
    findAll(query) {
        return this.lotesService.findAll(query);
    }
    findOne(id) {
        return this.lotesService.findOne(id);
    }
    update(id, updateLoteDto) {
        return this.lotesService.update(id, updateLoteDto);
    }
    remove(id) {
        return this.lotesService.remove(id);
    }
    getLotesDisponiveis() {
        return this.lotesService.getLotesDisponiveis();
    }
    getLotesByQuadra(quadra) {
        return this.lotesService.getLotesByQuadra(quadra);
    }
    getLotesByLoteamento(loteamento) {
        return this.lotesService.getLotesByLoteamento(loteamento);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lote_dto_1.CreateLoteDto]),
    __metadata("design:returntype", void 0)
], LotesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_lote_dto_1.QueryLoteDto]),
    __metadata("design:returntype", void 0)
], LotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LotesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_lote_dto_1.UpdateLoteDto]),
    __metadata("design:returntype", void 0)
], LotesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LotesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('status/disponiveis'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LotesController.prototype, "getLotesDisponiveis", null);
__decorate([
    (0, common_1.Get)('quadra/:quadra'),
    __param(0, (0, common_1.Param)('quadra')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LotesController.prototype, "getLotesByQuadra", null);
__decorate([
    (0, common_1.Get)('loteamento/:loteamento'),
    __param(0, (0, common_1.Param)('loteamento')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LotesController.prototype, "getLotesByLoteamento", null);
LotesController = __decorate([
    (0, common_1.Controller)('lotes'),
    __metadata("design:paramtypes", [lotes_service_1.LotesService])
], LotesController);
exports.LotesController = LotesController;
//# sourceMappingURL=lotes.controller.js.map