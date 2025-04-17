"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const clientes_module_1 = require("./modules/clientes/clientes.module");
const contratos_module_1 = require("./modules/contratos/contratos.module");
const boletos_module_1 = require("./modules/boletos/boletos.module");
const lotes_module_1 = require("./modules/lotes/lotes.module");
const inadimplencia_module_1 = require("./modules/inadimplencia/inadimplencia.module");
const reajustes_module_1 = require("./modules/reajustes/reajustes.module");
const documentos_module_1 = require("./modules/documentos/documentos.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const auth_module_1 = require("./modules/auth/auth.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            clientes_module_1.ClientesModule,
            contratos_module_1.ContratosModule,
            boletos_module_1.BoletosModule,
            lotes_module_1.LotesModule,
            inadimplencia_module_1.InadimplenciaModule,
            reajustes_module_1.ReajustesModule,
            documentos_module_1.DocumentosModule,
            dashboard_module_1.DashboardModule,
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map