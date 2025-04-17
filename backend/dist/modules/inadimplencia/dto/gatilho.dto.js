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
exports.ConfiguracaoGatilhosDto = exports.GatilhoDto = void 0;
const class_validator_1 = require("class-validator");
class GatilhoDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GatilhoDto.prototype, "dias", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GatilhoDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GatilhoDto.prototype, "ativo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GatilhoDto.prototype, "mensagem", void 0);
exports.GatilhoDto = GatilhoDto;
class ConfiguracaoGatilhosDto {
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConfiguracaoGatilhosDto.prototype, "executarAutomaticamente", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfiguracaoGatilhosDto.prototype, "horarioExecucao", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ConfiguracaoGatilhosDto.prototype, "diasExecucao", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConfiguracaoGatilhosDto.prototype, "repetirCobrancas", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ConfiguracaoGatilhosDto.prototype, "intervaloRepeticao", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConfiguracaoGatilhosDto.prototype, "limitarRepeticoes", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ConfiguracaoGatilhosDto.prototype, "limiteRepeticoes", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConfiguracaoGatilhosDto.prototype, "gerarLog", void 0);
exports.ConfiguracaoGatilhosDto = ConfiguracaoGatilhosDto;
//# sourceMappingURL=gatilho.dto.js.map