import { InadimplenciaService } from './inadimplencia.service';
import { QueryInadimplenciaDto } from './dto/query-inadimplencia.dto';
import { CreateInteracaoDto } from './dto/interacao.dto';
import { CreateComunicacaoDto } from './dto/comunicacao.dto';
import { ConfiguracaoGatilhosDto } from './dto/gatilho.dto';
export declare class InadimplenciaController {
    private readonly inadimplenciaService;
    constructor(inadimplenciaService: InadimplenciaService);
    listarClientesInadimplentes(query: QueryInadimplenciaDto): Promise<any[]>;
    obterClienteInadimplente(id: number): Promise<{
        id: number;
        clienteId: number;
        contratoId: number;
        valorEmAberto: number;
        diasAtraso: number;
        status: string;
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
        contrato: import("@prisma/client/runtime").GetResult<{
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
        }, unknown, never> & {};
        parcelas: {
            id: number;
            numero: number;
            dataVencimento: Date;
            valor: number;
            valorAtualizado: number;
            status: string;
        }[];
    }>;
    registrarInteracao(clienteId: number, createInteracaoDto: CreateInteracaoDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        clienteId: number;
        tipo: string;
        data: Date;
        observacao: string;
        usuario: string;
        parcelaId: string;
    }, unknown, never> & {}>;
    obterHistoricoInteracoes(clienteId: number): Promise<(import("@prisma/client/runtime").GetResult<{
        id: string;
        clienteId: number;
        tipo: string;
        data: Date;
        observacao: string;
        usuario: string;
        parcelaId: string;
    }, unknown, never> & {})[]>;
    gerarNovoBoleto(clienteId: number, parcelaId: string): Promise<import("@prisma/client/runtime").GetResult<{
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
    }, unknown, never> & {}>;
    obterGatilhos(): Promise<{
        executarAutomaticamente: boolean;
        horarioExecucao: string;
        diasExecucao: string[];
        repetirCobrancas: boolean;
        intervaloRepeticao: number;
        limitarRepeticoes: boolean;
        limiteRepeticoes: number;
        gerarLog: boolean;
        gatilhos: {
            dias: number;
            tipo: string;
            ativo: boolean;
            mensagem: string;
        }[];
    } | {
        gatilhos: any;
        id: number;
        executarAutomaticamente: boolean;
        horarioExecucao: string;
        diasExecucao: string[];
        repetirCobrancas: boolean;
        intervaloRepeticao: number;
        limitarRepeticoes: boolean;
        limiteRepeticoes: number;
        gerarLog: boolean;
    }>;
    salvarGatilhos(configuracaoGatilhosDto: ConfiguracaoGatilhosDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        executarAutomaticamente: boolean;
        horarioExecucao: string;
        diasExecucao: string[];
        repetirCobrancas: boolean;
        intervaloRepeticao: number;
        limitarRepeticoes: boolean;
        limiteRepeticoes: number;
        gerarLog: boolean;
        gatilhos: import(".prisma/client").Prisma.JsonValue;
    }, unknown, never> & {}>;
    enviarComunicacao(createComunicacaoDto: CreateComunicacaoDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        clienteId: number;
        tipo: string;
        data: Date;
        mensagem: string;
        status: string;
        parcelaInfo: import(".prisma/client").Prisma.JsonValue;
        anexos: import(".prisma/client").Prisma.JsonValue;
    }, unknown, never> & {}>;
    obterHistoricoComunicacoes(clienteId: number): Promise<(import("@prisma/client/runtime").GetResult<{
        id: string;
        clienteId: number;
        tipo: string;
        data: Date;
        mensagem: string;
        status: string;
        parcelaInfo: import(".prisma/client").Prisma.JsonValue;
        anexos: import(".prisma/client").Prisma.JsonValue;
    }, unknown, never> & {})[]>;
    enviarCobrancaAutomatica(data: {
        clienteId: number;
        parcelaId: string;
        gatilho: any;
    }): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        clienteId: number;
        tipo: string;
        data: Date;
        mensagem: string;
        status: string;
        parcelaInfo: import(".prisma/client").Prisma.JsonValue;
        anexos: import(".prisma/client").Prisma.JsonValue;
    }, unknown, never> & {}>;
    exportarDados(formato: string, query: QueryInadimplenciaDto): Promise<{
        data: Buffer;
        tipo: string;
        nome: string;
    }>;
}
