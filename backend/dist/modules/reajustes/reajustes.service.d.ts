import { PrismaService } from '../../prisma/prisma.service';
import { ParametrosReajusteDto } from './dto/parametros-reajuste.dto';
import { IndicesEconomicosDto } from './dto/indices-economicos.dto';
import { QueryReajusteDto } from './dto/query-reajuste.dto';
export declare class ReajustesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryReajusteDto): Promise<({
        contrato: {
            id: number;
            dataInicio: Date;
            cliente: {
                id: number;
                nome: string;
                cpfCnpj: string;
            };
        };
    } & {
        id: number;
        contratoId: number;
        parcelaReferencia: number;
        valorOriginal: import("@prisma/client/runtime/library").Decimal;
        valorReajustado: import("@prisma/client/runtime/library").Decimal;
        indiceAplicado: import("@prisma/client/runtime/library").Decimal;
        indiceBase: string;
        percentualAdicional: import("@prisma/client/runtime/library").Decimal;
        reajusteTotal: import("@prisma/client/runtime/library").Decimal;
        dataReferencia: Date;
        dataAplicacao: Date | null;
        status: string;
        aplicado: boolean;
    })[]>;
    findReajustesPrevistos(dataInicio?: string, dataFim?: string): Promise<any[]>;
    findParametrosReajuste(): Promise<{
        id: number;
        indiceBase: string;
        percentualAdicional: import("@prisma/client/runtime/library").Decimal;
        intervaloParcelas: number;
        alertaAntecipadoDias: number;
    }>;
    updateParametrosReajuste(parametrosReajusteDto: ParametrosReajusteDto): Promise<{
        id: number;
        indiceBase: string;
        percentualAdicional: import("@prisma/client/runtime/library").Decimal;
        intervaloParcelas: number;
        alertaAntecipadoDias: number;
    }>;
    findIndicesEconomicos(): Promise<{
        id: number;
        data: Date;
        IGPM: import("@prisma/client/runtime/library").Decimal;
        IPCA: import("@prisma/client/runtime/library").Decimal;
        INPC: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateIndicesEconomicos(indicesEconomicosDto: IndicesEconomicosDto): Promise<{
        id: number;
        data: Date;
        IGPM: import("@prisma/client/runtime/library").Decimal;
        IPCA: import("@prisma/client/runtime/library").Decimal;
        INPC: import("@prisma/client/runtime/library").Decimal;
    }>;
    aplicarReajuste(contratoId: number): Promise<{
        id: number;
        contratoId: number;
        parcelaReferencia: number;
        valorOriginal: import("@prisma/client/runtime/library").Decimal;
        valorReajustado: import("@prisma/client/runtime/library").Decimal;
        indiceAplicado: import("@prisma/client/runtime/library").Decimal;
        indiceBase: string;
        percentualAdicional: import("@prisma/client/runtime/library").Decimal;
        reajusteTotal: import("@prisma/client/runtime/library").Decimal;
        dataReferencia: Date;
        dataAplicacao: Date | null;
        status: string;
        aplicado: boolean;
    }>;
    simularReajuste(contratoId: number, parametrosOverride?: Partial<ParametrosReajusteDto>): Promise<{
        contratoId: number;
        contrato: {
            numero: string;
            valorAtual: number;
        };
        proximaParcelaReajuste: number;
        valorOriginal: number;
        valorReajustado: number;
        indiceAplicado: any;
        indiceBase: string;
        percentualAdicional: number | import("@prisma/client/runtime/library").Decimal;
        reajusteTotal: any;
        dataReferencia: Date;
        simulado: boolean;
    }>;
    findHistoricoReajustes(contratoId: number): Promise<{
        id: number;
        contratoId: number;
        parcelaReferencia: number;
        valorOriginal: import("@prisma/client/runtime/library").Decimal;
        valorReajustado: import("@prisma/client/runtime/library").Decimal;
        indiceAplicado: import("@prisma/client/runtime/library").Decimal;
        indiceBase: string;
        percentualAdicional: import("@prisma/client/runtime/library").Decimal;
        reajusteTotal: import("@prisma/client/runtime/library").Decimal;
        dataReferencia: Date;
        dataAplicacao: Date | null;
        status: string;
        aplicado: boolean;
    }[]>;
    gerarRelatorioReajustes(query: QueryReajusteDto): Promise<{
        dataCriacao: string;
        totalContratos: number;
        filtrosAplicados: QueryReajusteDto;
        contratos: {
            contratoId: number;
            numeroContrato: string;
            cliente: any;
            documentoCliente: any;
            reajustes: any[];
            valorTotalOriginal: any;
            valorTotalReajustado: any;
            diferencaTotal: number;
            percentualAcumulado: number;
        }[];
    }>;
}
