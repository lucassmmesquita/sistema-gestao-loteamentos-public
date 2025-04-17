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
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        parcelaReferencia: number;
        valorOriginal: import("@prisma/client/runtime").Decimal;
        valorReajustado: import("@prisma/client/runtime").Decimal;
        indiceAplicado: import("@prisma/client/runtime").Decimal;
        indiceBase: string;
        percentualAdicional: import("@prisma/client/runtime").Decimal;
        reajusteTotal: import("@prisma/client/runtime").Decimal;
        dataReferencia: Date;
        dataAplicacao: Date;
        status: string;
        aplicado: boolean;
    }, unknown, never> & {})[]>;
    findReajustesPrevistos(dataInicio?: string, dataFim?: string): Promise<any[]>;
    findParametrosReajuste(): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        indiceBase: string;
        percentualAdicional: import("@prisma/client/runtime").Decimal;
        intervaloParcelas: number;
        alertaAntecipadoDias: number;
    }, unknown, never> & {}>;
    updateParametrosReajuste(parametrosReajusteDto: ParametrosReajusteDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        indiceBase: string;
        percentualAdicional: import("@prisma/client/runtime").Decimal;
        intervaloParcelas: number;
        alertaAntecipadoDias: number;
    }, unknown, never> & {}>;
    findIndicesEconomicos(): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        IGPM: import("@prisma/client/runtime").Decimal;
        IPCA: import("@prisma/client/runtime").Decimal;
        INPC: import("@prisma/client/runtime").Decimal;
        data: Date;
    }, unknown, never> & {}>;
    updateIndicesEconomicos(indicesEconomicosDto: IndicesEconomicosDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        IGPM: import("@prisma/client/runtime").Decimal;
        IPCA: import("@prisma/client/runtime").Decimal;
        INPC: import("@prisma/client/runtime").Decimal;
        data: Date;
    }, unknown, never> & {}>;
    aplicarReajuste(contratoId: number): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        parcelaReferencia: number;
        valorOriginal: import("@prisma/client/runtime").Decimal;
        valorReajustado: import("@prisma/client/runtime").Decimal;
        indiceAplicado: import("@prisma/client/runtime").Decimal;
        indiceBase: string;
        percentualAdicional: import("@prisma/client/runtime").Decimal;
        reajusteTotal: import("@prisma/client/runtime").Decimal;
        dataReferencia: Date;
        dataAplicacao: Date;
        status: string;
        aplicado: boolean;
    }, unknown, never> & {}>;
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
        percentualAdicional: number | import("@prisma/client/runtime").Decimal;
        reajusteTotal: any;
        dataReferencia: Date;
        simulado: boolean;
    }>;
    findHistoricoReajustes(contratoId: number): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        parcelaReferencia: number;
        valorOriginal: import("@prisma/client/runtime").Decimal;
        valorReajustado: import("@prisma/client/runtime").Decimal;
        indiceAplicado: import("@prisma/client/runtime").Decimal;
        indiceBase: string;
        percentualAdicional: import("@prisma/client/runtime").Decimal;
        reajusteTotal: import("@prisma/client/runtime").Decimal;
        dataReferencia: Date;
        dataAplicacao: Date;
        status: string;
        aplicado: boolean;
    }, unknown, never> & {})[]>;
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
