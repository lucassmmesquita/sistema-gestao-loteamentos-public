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
const registrar_interacao_dto_1 = require("./dto/registrar-interacao.dto");
const enviar_comunicacao_dto_1 = require("./dto/enviar-comunicacao.dto");
const gerar_boleto_dto_1 = require("./dto/gerar-boleto.dto");
const salvar_gatilhos_dto_1 = require("./dto/salvar-gatilhos.dto");
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
    obterHistoricoInteracoes(id) {
        return this.inadimplenciaService.obterHistoricoInteracoes(id);
    }
    registrarInteracao(id, dados) {
        return this.inadimplenciaService.registrarInteracao(id, dados);
    }
    obterHistoricoComunicacoes(id) {
        return this.inadimplenciaService.obterHistoricoComunicacoes(id);
    }
    enviarComunicacao(dados) {
        return this.inadimplenciaService.enviarComunicacao(dados);
    }
    gerarNovoBoleto(clienteId, parcelaId, dados) {
        return this.inadimplenciaService.gerarNovoBoleto(clienteId, parcelaId, dados);
    }
    obterGatilhos() {
        return this.inadimplenciaService.obterGatilhos();
    }
    salvarGatilhos(dados) {
        return this.inadimplenciaService.salvarGatilhos(dados);
    }
    enviarCobrancaAutomatica(dados) {
        return this.inadimplenciaService.enviarCobrancaAutomatica(dados);
    }
    exportarDados(formato, filtros) {
        return this.inadimplenciaService.exportarDados(formato, filtros);
    }
};
__decorate([
    (0, common_1.Get)('clientes'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_inadimplencia_dto_1.QueryInadimplenciaDto]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "listarClientesInadimplentes", null);
__decorate([
    (0, common_1.Get)('clientes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "obterClienteInadimplente", null);
__decorate([
    (0, common_1.Get)('clientes/:id/interacoes'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "obterHistoricoInteracoes", null);
__decorate([
    (0, common_1.Post)('clientes/:id/interacoes'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, registrar_interacao_dto_1.RegistrarInteracaoDto]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "registrarInteracao", null);
__decorate([
    (0, common_1.Get)('clientes/:id/comunicacoes'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "obterHistoricoComunicacoes", null);
__decorate([
    (0, common_1.Post)('comunicacao/enviar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [enviar_comunicacao_dto_1.EnviarComunicacaoDto]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "enviarComunicacao", null);
__decorate([
    (0, common_1.Post)('clientes/:clienteId/parcelas/:parcelaId/boleto'),
    __param(0, (0, common_1.Param)('clienteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('parcelaId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, gerar_boleto_dto_1.GerarBoletoDto]),
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
    __metadata("design:paramtypes", [salvar_gatilhos_dto_1.SalvarGatilhosDto]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "salvarGatilhos", null);
__decorate([
    (0, common_1.Post)('comunicacao/automatica'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InadimplenciaController.prototype, "enviarCobrancaAutomatica", null);
__decorate([
    (0, common_1.Get)('exportar'),
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