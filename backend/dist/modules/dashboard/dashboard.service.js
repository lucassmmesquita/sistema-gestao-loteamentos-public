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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardData() {
        try {
            const totalClientes = await this.prisma.cliente.count();
            const totalContratos = await this.prisma.contrato.count();
            const totalLotes = await this.prisma.lote.count();
            const lotesDisponiveis = await this.prisma.lote.count({
                where: { status: 'disponivel' }
            });
            const lotesReservados = await this.prisma.lote.count({
                where: { status: 'reservado' }
            });
            const lotesVendidos = await this.prisma.lote.count({
                where: { status: 'vendido' }
            });
            const resultadoValorTotal = await this.prisma.contrato.aggregate({
                _sum: {
                    valorTotal: true
                }
            });
            const valorTotalContratos = Number(resultadoValorTotal._sum.valorTotal || 0);
            let valorMedioContratos = 0;
            if (totalContratos > 0) {
                valorMedioContratos = valorTotalContratos / totalContratos;
            }
            return {
                totalClientes,
                totalContratos,
                totalLotes,
                lotesDisponiveis,
                lotesReservados,
                lotesVendidos,
                valorTotalContratos,
                valorMedioContratos
            };
        }
        catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
            throw new Error('Não foi possível carregar os dados do dashboard');
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map