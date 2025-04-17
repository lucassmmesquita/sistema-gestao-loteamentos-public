"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoletosModule = void 0;
const common_1 = require("@nestjs/common");
const boletos_service_1 = require("./boletos.service");
const boletos_controller_1 = require("./boletos.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
let BoletosModule = class BoletosModule {
};
BoletosModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [boletos_controller_1.BoletosController],
        providers: [boletos_service_1.BoletosService],
        exports: [boletos_service_1.BoletosService],
    })
], BoletosModule);
exports.BoletosModule = BoletosModule;
//# sourceMappingURL=boletos.module.js.map