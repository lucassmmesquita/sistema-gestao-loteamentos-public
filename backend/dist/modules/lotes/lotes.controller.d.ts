import { LotesService } from './lotes.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { QueryLoteDto } from './dto/query-lote.dto';
export declare class LotesController {
    private readonly lotesService;
    constructor(lotesService: LotesService);
    create(createLoteDto: CreateLoteDto): Promise<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime/library").Decimal;
        status: string;
    }>;
    findAll(query: QueryLoteDto): Promise<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime/library").Decimal;
        status: string;
    }[]>;
    findOne(id: number): Promise<{
        contratos: ({
            cliente: {
                id: number;
                nome: string;
                cpfCnpj: string;
            };
        } & {
            id: number;
            status: string;
            clienteId: number;
            loteId: number;
            dataInicio: Date;
            dataFim: Date;
            valorTotal: import("@prisma/client/runtime/library").Decimal;
            valorEntrada: import("@prisma/client/runtime/library").Decimal;
            numeroParcelas: number;
            dataVencimento: number;
            clausulas: string;
            dataCriacao: Date;
            parcelasPagas: number;
            ultimoReajuste: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime/library").Decimal;
        status: string;
    }>;
    update(id: number, updateLoteDto: UpdateLoteDto): Promise<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime/library").Decimal;
        status: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime/library").Decimal;
        status: string;
    }>;
    getLotesDisponiveis(): Promise<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime/library").Decimal;
        status: string;
    }[]>;
    getLotesByQuadra(quadra: string): Promise<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime/library").Decimal;
        status: string;
    }[]>;
    getLotesByLoteamento(loteamento: string): Promise<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime/library").Decimal;
        status: string;
    }[]>;
}
