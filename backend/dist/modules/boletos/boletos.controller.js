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
exports.BoletosController = void 0;
const common_1 = require("@nestjs/common");
const boletos_service_1 = require("./boletos.service");
const create_boleto_dto_1 = require("./dto/create-boleto.dto");
let BoletosController = class BoletosController {
    constructor(boletosService) {
        this.boletosService = boletosService;
    }
    gerarBoleto(createBoletoDto) {
        return this.boletosService.gerarBoleto(createBoletoDto);
    }
    findAll(query) {
        return this.boletosService.findAll(query);
    }
    findOne(id) {
        return this.boletosService.findOne(id);
    }
    cancelarBoleto(id) {
        return this.boletosService.cancel(id);
    }
    registrarPagamento(id, dadosPagamento) {
        return this.boletosService.registrarPagamento(id, dadosPagamento);
    }
    registrarPagamentosEmLote(pagamentos) {
    }
    atualizarStatusPorArquivoRetorno(registros) {
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_boleto_dto_1.CreateBoletoDto]),
    __metadata("design:returntype", void 0)
], BoletosController.prototype, "gerarBoleto", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BoletosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BoletosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/cancelar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BoletosController.prototype, "cancelarBoleto", null);
__decorate([
    (0, common_1.Patch)(':id/pagamento'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], BoletosController.prototype, "registrarPagamento", null);
__decorate([
    (0, common_1.Post)('pagamentos/lote'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], BoletosController.prototype, "registrarPagamentosEmLote", null);
__decorate([
    (0, common_1.Patch)('status/arquivo-retorno'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], BoletosController.prototype, "atualizarStatusPorArquivoRetorno", null);
BoletosController = __decorate([
    (0, common_1.Controller)('boletos'),
    __metadata("design:paramtypes", [boletos_service_1.BoletosService])
], BoletosController);
exports.BoletosController = BoletosController;
//# sourceMappingURL=boletos.controller.js.map