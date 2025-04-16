import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
