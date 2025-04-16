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
exports.ReajustesController = void 0;
const common_1 = require("@nestjs/common");
const reajustes_service_1 = require("./reajustes.service");
const parametros_reajuste_dto_1 = require("./dto/parametros-reajuste.dto");
const indices_economicos_dto_1 = require("./dto/indices-economicos.dto");
const query_reajuste_dto_1 = require("./dto/query-reajuste.dto");
let ReajustesController = class ReajustesController {
    constructor(reajustesService) {
        this.reajustesService = reajustesService;
    }
    findAll(query) {
        return this.reajustesService.findAll(query);
    }
    findReajustesPrevistos(dataInicio, dataFim) {
        return this.reajustesService.findReajustesPrevistos(dataInicio, dataFim);
    }
    findParametrosReajuste() {
        return this.reajustesService.findParametrosReajuste();
    }
    updateParametrosReajuste(parametrosReajusteDto) {
        return this.reajustesService.updateParametrosReajuste(parametrosReajusteDto);
    }
    findIndicesEconomicos() {
        return this.reajustesService.findIndicesEconomicos();
    }
    updateIndicesEconomicos(indicesEconomicosDto) {
        return this.reajustesService.updateIndicesEconomicos(indicesEconomicosDto);
    }
    aplicarReajuste(contratoId) {
        return this.reajustesService.aplicarReajuste(contratoId);
    }
    simularReajuste(contratoId, parametrosOverride) {
        return this.reajustesService.simularReajuste(contratoId, parametrosOverride);
    }
    findHistoricoReajustes(contratoId) {
        return this.reajustesService.findHistoricoReajustes(contratoId);
    }
    gerarRelatorioReajustes(query) {
        return this.reajustesService.gerarRelatorioReajustes(query);
    }
};
exports.ReajustesController = ReajustesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_reajuste_dto_1.QueryReajusteDto]),
    __metadata("design:returntype", void 0)
], ReajustesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('previstos'),
    __param(0, (0, common_1.Query)('dataInicio')),
    __param(1, (0, common_1.Query)('dataFim')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReajustesController.prototype, "findReajustesPrevistos", null);
__decorate([
    (0, common_1.Get)('parametros'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReajustesController.prototype, "findParametrosReajuste", null);
__decorate([
    (0, common_1.Patch)('parametros'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parametros_reajuste_dto_1.ParametrosReajusteDto]),
    __metadata("design:returntype", void 0)
], ReajustesController.prototype, "updateParametrosReajuste", null);
__decorate([
    (0, common_1.Get)('indices-economicos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReajustesController.prototype, "findIndicesEconomicos", null);
__decorate([
    (0, common_1.Patch)('indices-economicos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [indices_economicos_dto_1.IndicesEconomicosDto]),
    __metadata("design:returntype", void 0)
], ReajustesController.prototype, "updateIndicesEconomicos", null);
__decorate([
    (0, common_1.Post)('aplicar/:contratoId'),
    __param(0, (0, common_1.Param)('contratoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReajustesController.prototype, "aplicarReajuste", null);
__decorate([
    (0, common_1.Post)('simular/:contratoId'),
    __param(0, (0, common_1.Param)('contratoId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ReajustesController.prototype, "simularReajuste", null);
__decorate([
    (0, common_1.Get)('historico/:contratoId'),
    __param(0, (0, common_1.Param)('contratoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReajustesController.prototype, "findHistoricoReajustes", null);
__decorate([
    (0, common_1.Get)('relatorio'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_reajuste_dto_1.QueryReajusteDto]),
    __metadata("design:returntype", void 0)
], ReajustesController.prototype, "gerarRelatorioReajustes", null);
exports.ReajustesController = ReajustesController = __decorate([
    (0, common_1.Controller)('reajustes'),
    __metadata("design:paramtypes", [reajustes_service_1.ReajustesService])
], ReajustesController);
//# sourceMappingURL=reajustes.controller.js.map