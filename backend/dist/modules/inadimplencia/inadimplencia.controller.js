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
exports.InadimplenciaController = void 0;
const common_1 = require("@nestjs/common");
const inadimplencia_service_1 = require("./inadimplencia.service");
const query_inadimplencia_dto_1 = require("./dto/query-inadimplencia.dto");
const interacao_dto_1 = require("./dto/interacao.dto");
const comunicacao_dto_1 = require("./dto/comunicacao.dto");
const gatilho_dto_1 = require("./dto/gatilho.dto");
let InadimplenciaController = class InadimplenciaController {
    constructor(inadimplenciaService) {
        this.inadimplenciaService = inadimplenciaService;
    }
    listarClientesInadimplentes(query) {
        return this.inadimplenciaService.listarClientesInadimplentes(query);
    }
    obterClienteInadimplente(id) {
        return this.inadimplenciaService.obterClienteInadimplente(id);
    }
    registrarInteracao(clienteId, createInteracaoDto) {
        return this.inadimplenciaService.registrarInteracao(clienteId, createInteracaoDto);
    }
    obterHistoricoInteracoes(clienteId) {
        return this.inadimplenciaService.obterHistoricoInteracoes(clienteId);
    }
    gerarNovoBoleto(clienteId, parcelaId) {
        return this.inadimplenciaService.gerarNovoBoleto(clienteId, parcelaId);
    }
    obterGatilhos() {
        return this.inadimplenciaService.obterGatilhos();
    }
    salvarGatilhos(configuracaoGatilhosDto) {
        return this.inadimplenciaService.salvarGatilhos(configuracaoGatilhosDto);
    }
    enviarComunicacao(createComunicacaoDto) {
        return this.inadimplenciaService.enviarComunicacao(createComunicacaoDto);
    }
    obterHistoricoComunicacoes(clienteId) {
        return this.inadimplenciaService.obterHistoricoComunicacoes(clienteId);
    }
    enviarCobrancaAutomatica(data) {
        return this.inadimplenciaService.enviarCobrancaAutomatica(data.clienteId, data.parcelaId, data.gatilho);
    }
    exportarDados(formato, query) {
        return this.inadimplenciaService.exportarDados(formato, query);
    }
};
__decorate([
    (0, common_1.Get)('clientes-inadimplentes'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_inadimplencia_dto_1.QueryInadimplenciaDto]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "listarClientesInadimplentes", null);
__decorate([
    (0, common_1.Get)('clientes-inadimplentes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "obterClienteInadimplente", null);
__decorate([
    (0, common_1.Post)('clientes/:clienteId/interacoes'),
    __param(0, (0, common_1.Param)('clienteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, interacao_dto_1.CreateInteracaoDto]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "registrarInteracao", null);
__decorate([
    (0, common_1.Get)('clientes/:clienteId/interacoes'),
    __param(0, (0, common_1.Param)('clienteId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "obterHistoricoInteracoes", null);
__decorate([
    (0, common_1.Post)('clientes/:clienteId/parcelas/:parcelaId/boleto'),
    __param(0, (0, common_1.Param)('clienteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parcelaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "gerarNovoBoleto", null);
__decorate([
    (0, common_1.Get)('configuracoes/gatilhos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "obterGatilhos", null);
__decorate([
    (0, common_1.Put)('configuracoes/gatilhos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gatilho_dto_1.ConfiguracaoGatilhosDto]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "salvarGatilhos", null);
__decorate([
    (0, common_1.Post)('comunicacao/enviar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comunicacao_dto_1.CreateComunicacaoDto]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "enviarComunicacao", null);
__decorate([
    (0, common_1.Get)('clientes/:clienteId/comunicacoes'),
    __param(0, (0, common_1.Param)('clienteId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "obterHistoricoComunicacoes", null);
__decorate([
    (0, common_1.Post)('comunicacao/automatica'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "enviarCobrancaAutomatica", null);
__decorate([
    (0, common_1.Get)('clientes-inadimplentes/exportar'),
    __param(0, (0, common_1.Query)('formato')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_inadimplencia_dto_1.QueryInadimplenciaDto]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "exportarDados", null);
InadimplenciaController = __decorate([
    (0, common_1.Controller)('inadimplencia'),
    __metadata("design:paramtypes", [inadimplencia_service_1.InadimplenciaService])
], InadimplenciaController);
exports.InadimplenciaController = InadimplenciaController;
//# sourceMappingURL=inadimplencia.controller.js.map