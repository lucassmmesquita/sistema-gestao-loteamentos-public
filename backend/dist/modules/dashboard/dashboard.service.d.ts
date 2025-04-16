import { PrismaService } from '../../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardData(): Promise<{
        totalClientes: number;
        totalContratos: number;
        totalLotes: number;
        lotesDisponiveis: number;
        lotesReservados: number;
        lotesVendidos: number;
        valorTotalContratos: number;
        valorMedioContratos: number;
    }>;
}
