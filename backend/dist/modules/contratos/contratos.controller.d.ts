import { ContratosService } from './contratos.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { QueryContratoDto } from './dto/query-contrato.dto';
export declare class ContratosController {
    private readonly contratosService;
    constructor(contratosService: ContratosService);
    create(createContratoDto: CreateContratoDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        loteId: number;
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
    }, unknown, never> & {}>;
    findAll(query: QueryContratoDto): Promise<({
        cliente: {
            id: number;
            nome: string;
            cpfCnpj: string;
        };
        lote: import("@prisma/client/runtime").GetResult<{
            id: number;
            numero: string;
            quadra: string;
            loteamento: string;
            area: number;
            valorBase: import("@prisma/client/runtime").Decimal;
            status: string;
        }, unknown, never> & {};
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        loteId: number;
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
    }, unknown, never> & {})[]>;
    findOne(id: number): Promise<{
        cliente: {
            endereco: import("@prisma/client/runtime").GetResult<{
                id: number;
                clienteId: number;
                cep: string;
                logradouro: string;
                numero: string;
                complemento: string;
                bairro: string;
                cidade: string;
                estado: string;
            }, unknown, never> & {};
            contatos: import("@prisma/client/runtime").GetResult<{
                id: number;
                clienteId: number;
                telefones: string[];
                emails: string[];
            }, unknown, never> & {};
        } & import("@prisma/client/runtime").GetResult<{
            id: number;
            nome: string;
            cpfCnpj: string;
            dataNascimento: Date;
            dataCadastro: Date;
        }, unknown, never> & {};
        lote: import("@prisma/client/runtime").GetResult<{
            id: number;
            numero: string;
            quadra: string;
            loteamento: string;
            area: number;
            valorBase: import("@prisma/client/runtime").Decimal;
            status: string;
        }, unknown, never> & {};
        boletos: (import("@prisma/client/runtime").GetResult<{
            id: number;
            clienteId: number;
            clienteNome: string;
            contratoId: number;
            valor: import("@prisma/client/runtime").Decimal;
            dataVencimento: Date;
            numeroParcela: number;
            descricao: string;
            nossoNumero: string;
            linhaDigitavel: string;
            codigoBarras: string;
            pdfUrl: string;
            dataGeracao: Date;
            status: string;
            dataPagamento: Date;
            valorPago: import("@prisma/client/runtime").Decimal;
            formaPagamento: string;
            dataCancelamento: Date;
            comprovante: string;
        }, unknown, never> & {})[];
        reajustes: (import("@prisma/client/runtime").GetResult<{
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
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        loteId: number;
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
    }, unknown, never> & {}>;
    update(id: number, updateContratoDto: UpdateContratoDto): Promise<{
        cliente: import("@prisma/client/runtime").GetResult<{
            id: number;
            nome: string;
            cpfCnpj: string;
            dataNascimento: Date;
            dataCadastro: Date;
        }, unknown, never> & {};
        lote: import("@prisma/client/runtime").GetResult<{
            id: number;
            numero: string;
            quadra: string;
            loteamento: string;
            area: number;
            valorBase: import("@prisma/client/runtime").Decimal;
            status: string;
        }, unknown, never> & {};
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        loteId: number;
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
    }, unknown, never> & {}>;
    remove(id: number): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        loteId: number;
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
    }, unknown, never> & {}>;
    getByClienteId(clienteId: number): Promise<({
        lote: import("@prisma/client/runtime").GetResult<{
            id: number;
            numero: string;
            quadra: string;
            loteamento: string;
            area: number;
            valorBase: import("@prisma/client/runtime").Decimal;
            status: string;
        }, unknown, never> & {};
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        loteId: number;
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
    }, unknown, never> & {})[]>;
    getLotesDisponiveis(): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        numero: string;
        quadra: string;
        loteamento: string;
        area: number;
        valorBase: import("@prisma/client/runtime").Decimal;
        status: string;
    }, unknown, never> & {})[]>;
    gerarPrevia(contratoDto: CreateContratoDto): Promise<string>;
}
