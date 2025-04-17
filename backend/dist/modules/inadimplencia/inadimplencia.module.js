"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InadimplenciaModule = void 0;
const common_1 = require("@nestjs/common");
const inadimplencia_service_1 = require("./inadimplencia.service");
const inadimplencia_controller_1 = require("./inadimplencia.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
let InadimplenciaModule = class InadimplenciaModule {
};
InadimplenciaModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [inadimplencia_controller_1.InadimplenciaController],
        providers: [inadimplencia_service_1.InadimplenciaService],
        exports: [inadimplencia_service_1.InadimplenciaService],
    })
], InadimplenciaModule);
exports.InadimplenciaModule = InadimplenciaModule;
//# sourceMappingURL=inadimplencia.module.js.map