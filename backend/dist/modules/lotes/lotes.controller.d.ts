import { LotesService } from './lotes.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { QueryLoteDto } from './dto/query-lote.dto';
import { ImportLoteDto } from './dto/import-lote.dto';
export declare class LotesController {
    private readonly lotesService;
    constructor(lotesService: LotesService);
    importLotes(importLotesDto: ImportLoteDto[]): Promise<{
        total: number;
        processed: number;
        results: any[];
    }>;
    create(createLoteDto: CreateLoteDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime").Decimal;
        status: string;
        chave: string;
    }, unknown, never> & {}>;
    findAll(query: QueryLoteDto): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime").Decimal;
        status: string;
        chave: string;
    }, unknown, never> & {})[]>;
    findOne(id: number): Promise<{
        contratos: ({
            cliente: {
                id: number;
                nome: string;
                cpfCnpj: string;
            };
        } & import("@prisma/client/runtime").GetResult<{
            id: number;
            clienteId: number;
            loteId: number;
            chave: string;
            numeroContrato: string;
            dataEmissao: Date;
            dataPrimeiraPrestacao: Date;
            valorPrestacao: import("@prisma/client/runtime").Decimal;
            dataInicio: Date;
            dataFim: Date;
            valorTotal: import("@prisma/client/runtime").Decimal;
            valorEntrada: import("@prisma/client/runtime").Decimal;
            numeroParcelas: number;
            dataVencimento: number;
            clausulas: string;
            status: string;
            dataCriacao: Date;
            parcelasPagas: number;
            ultimoReajuste: import(".prisma/client").Prisma.JsonValue;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime").Decimal;
        status: string;
        chave: string;
    }, unknown, never> & {}>;
    update(id: number, updateLoteDto: UpdateLoteDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime").Decimal;
        status: string;
        chave: string;
    }, unknown, never> & {}>;
    remove(id: number): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime").Decimal;
        status: string;
        chave: string;
    }, unknown, never> & {}>;
    getLotesDisponiveis(): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime").Decimal;
        status: string;
        chave: string;
    }, unknown, never> & {})[]>;
    getLotesByQuadra(quadra: string): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime").Decimal;
        status: string;
        chave: string;
    }, unknown, never> & {})[]>;
    getLotesByLoteamento(loteamento: string): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime").Decimal;
        status: string;
        chave: string;
    }, unknown, never> & {})[]>;
}
