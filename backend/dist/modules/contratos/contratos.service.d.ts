import { PrismaService } from '../../prisma/prisma.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { QueryContratoDto } from './dto/query-contrato.dto';
export declare class ContratosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createContratoDto: CreateContratoDto): Promise<{
        id: number;
        clienteId: number;
        loteId: number;
        dataInicio: Date;
        dataFim: Date;
        valorTotal: import("@prisma/client/runtime/library").Decimal;
        valorEntrada: import("@prisma/client/runtime/library").Decimal;
        numeroParcelas: number;
        dataVencimento: number;
        clausulas: string;
        status: string;
        dataCriacao: Date;
        parcelasPagas: number;
        ultimoReajuste: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findAll(query: QueryContratoDto): Promise<({
        cliente: {
            nome: string;
            cpfCnpj: string;
            id: number;
        };
        lote: {
            numero: string;
            id: number;
            status: string;
            quadra: string;
            loteamento: string;
            area: number;
            valorBase: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: number;
        clienteId: number;
        loteId: number;
        dataInicio: Date;
        dataFim: Date;
        valorTotal: import("@prisma/client/runtime/library").Decimal;
        valorEntrada: import("@prisma/client/runtime/library").Decimal;
        numeroParcelas: number;
        dataVencimento: number;
        clausulas: string;
        status: string;
        dataCriacao: Date;
        parcelasPagas: number;
        ultimoReajuste: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findOne(id: number): Promise<{
        cliente: {
            endereco: {
                cep: string;
                logradouro: string;
                numero: string;
                complemento: string | null;
                bairro: string;
                cidade: string;
                estado: string;
                id: number;
                clienteId: number;
            };
            contatos: {
                telefones: string[];
                emails: string[];
                id: number;
                clienteId: number;
            };
        } & {
            nome: string;
            cpfCnpj: string;
            dataNascimento: Date | null;
            id: number;
            dataCadastro: Date;
        };
        lote: {
            numero: string;
            id: number;
            status: string;
            quadra: string;
            loteamento: string;
            area: number;
            valorBase: import("@prisma/client/runtime/library").Decimal;
        };
        boletos: {
            id: number;
            clienteId: number;
            dataVencimento: Date;
            status: string;
            clienteNome: string;
            contratoId: number;
            valor: import("@prisma/client/runtime/library").Decimal;
            numeroParcela: number;
            descricao: string;
            nossoNumero: string;
            linhaDigitavel: string;
            codigoBarras: string;
            pdfUrl: string;
            dataGeracao: Date;
            dataPagamento: Date | null;
            valorPago: import("@prisma/client/runtime/library").Decimal | null;
            formaPagamento: string | null;
            dataCancelamento: Date | null;
            comprovante: string | null;
        }[];
        reajustes: {
            id: number;
            status: string;
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
            aplicado: boolean;
        }[];
    } & {
        id: number;
        clienteId: number;
        loteId: number;
        dataInicio: Date;
        dataFim: Date;
        valorTotal: import("@prisma/client/runtime/library").Decimal;
        valorEntrada: import("@prisma/client/runtime/library").Decimal;
        numeroParcelas: number;
        dataVencimento: number;
        clausulas: string;
        status: string;
        dataCriacao: Date;
        parcelasPagas: number;
        ultimoReajuste: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(id: number, updateContratoDto: UpdateContratoDto): Promise<{
        cliente: {
            nome: string;
            cpfCnpj: string;
            dataNascimento: Date | null;
            id: number;
            dataCadastro: Date;
        };
        lote: {
            numero: string;
            id: number;
            status: string;
            quadra: string;
            loteamento: string;
            area: number;
            valorBase: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: number;
        clienteId: number;
        loteId: number;
        dataInicio: Date;
        dataFim: Date;
        valorTotal: import("@prisma/client/runtime/library").Decimal;
        valorEntrada: import("@prisma/client/runtime/library").Decimal;
        numeroParcelas: number;
        dataVencimento: number;
        clausulas: string;
        status: string;
        dataCriacao: Date;
        parcelasPagas: number;
        ultimoReajuste: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        clienteId: number;
        loteId: number;
        dataInicio: Date;
        dataFim: Date;
        valorTotal: import("@prisma/client/runtime/library").Decimal;
        valorEntrada: import("@prisma/client/runtime/library").Decimal;
        numeroParcelas: number;
        dataVencimento: number;
        clausulas: string;
        status: string;
        dataCriacao: Date;
        parcelasPagas: number;
        ultimoReajuste: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getByClienteId(clienteId: number): Promise<({
        lote: {
            numero: string;
            id: number;
            status: string;
            quadra: string;
            loteamento: string;
            area: number;
            valorBase: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: number;
        clienteId: number;
        loteId: number;
        dataInicio: Date;
        dataFim: Date;
        valorTotal: import("@prisma/client/runtime/library").Decimal;
        valorEntrada: import("@prisma/client/runtime/library").Decimal;
        numeroParcelas: number;
        dataVencimento: number;
        clausulas: string;
        status: string;
        dataCriacao: Date;
        parcelasPagas: number;
        ultimoReajuste: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    getLotesDisponiveis(): Promise<{
        numero: string;
        id: number;
        status: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    gerarPrevia(contratoDto: CreateContratoDto): Promise<string>;
}
