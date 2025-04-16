import { PrismaService } from '../../prisma/prisma.service';
import { QueryInadimplenciaDto } from './dto/query-inadimplencia.dto';
import { CreateInteracaoDto } from './dto/interacao.dto';
import { CreateComunicacaoDto } from './dto/comunicacao.dto';
import { ConfiguracaoGatilhosDto } from './dto/gatilho.dto';
export declare class InadimplenciaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listarClientesInadimplentes(query: QueryInadimplenciaDto): Promise<any[]>;
    obterClienteInadimplente(id: number): Promise<{
        id: number;
        clienteId: number;
        contratoId: number;
        valorEmAberto: number;
        diasAtraso: number;
        status: string;
        cliente: {
            endereco: {
                id: number;
                clienteId: number;
                cep: string;
                logradouro: string;
                numero: string;
                complemento: string | null;
                bairro: string;
                cidade: string;
                estado: string;
            };
            contatos: {
                id: number;
                clienteId: number;
                telefones: string[];
                emails: string[];
            };
        } & {
            id: number;
            nome: string;
            cpfCnpj: string;
            dataNascimento: Date | null;
            dataCadastro: Date;
        };
        contrato: {
            id: number;
            clienteId: number;
            dataVencimento: number;
            status: string;
            loteId: number;
            dataInicio: Date;
            dataFim: Date;
            valorTotal: import("@prisma/client/runtime/library").Decimal;
            valorEntrada: import("@prisma/client/runtime/library").Decimal;
            numeroParcelas: number;
            clausulas: string;
            dataCriacao: Date;
            parcelasPagas: number;
            ultimoReajuste: import("@prisma/client/runtime/library").JsonValue | null;
        };
        parcelas: {
            id: number;
            numero: number;
            dataVencimento: Date;
            valor: number;
            valorAtualizado: number;
            status: string;
        }[];
    }>;
    registrarInteracao(clienteId: number, createInteracaoDto: CreateInteracaoDto): Promise<{
        id: string;
        clienteId: number;
        tipo: string;
        data: Date;
        observacao: string;
        usuario: string;
        parcelaId: string | null;
    }>;
    obterHistoricoInteracoes(clienteId: number): Promise<{
        id: string;
        clienteId: number;
        tipo: string;
        data: Date;
        observacao: string;
        usuario: string;
        parcelaId: string | null;
    }[]>;
    gerarNovoBoleto(clienteId: number, parcelaId: string): Promise<{
        id: number;
        clienteId: number;
        clienteNome: string;
        contratoId: number;
        valor: import("@prisma/client/runtime/library").Decimal;
        dataVencimento: Date;
        numeroParcela: number;
        descricao: string;
        nossoNumero: string;
        linhaDigitavel: string;
        codigoBarras: string;
        pdfUrl: string;
        dataGeracao: Date;
        status: string;
        dataPagamento: Date | null;
        valorPago: import("@prisma/client/runtime/library").Decimal | null;
        formaPagamento: string | null;
        dataCancelamento: Date | null;
        comprovante: string | null;
    }>;
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
    salvarGatilhos(configuracaoGatilhosDto: ConfiguracaoGatilhosDto): Promise<{
        id: number;
        executarAutomaticamente: boolean;
        horarioExecucao: string;
        diasExecucao: string[];
        repetirCobrancas: boolean;
        intervaloRepeticao: number;
        limitarRepeticoes: boolean;
        limiteRepeticoes: number;
        gerarLog: boolean;
        gatilhos: import("@prisma/client/runtime/library").JsonValue;
    }>;
    enviarComunicacao(createComunicacaoDto: CreateComunicacaoDto): Promise<{
        id: string;
        clienteId: number;
        status: string;
        tipo: string;
        data: Date;
        mensagem: string;
        parcelaInfo: import("@prisma/client/runtime/library").JsonValue | null;
        anexos: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    obterHistoricoComunicacoes(clienteId: number): Promise<{
        id: string;
        clienteId: number;
        status: string;
        tipo: string;
        data: Date;
        mensagem: string;
        parcelaInfo: import("@prisma/client/runtime/library").JsonValue | null;
        anexos: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    enviarCobrancaAutomatica(clienteId: number, parcelaId: string, gatilho: any): Promise<{
        id: string;
        clienteId: number;
        status: string;
        tipo: string;
        data: Date;
        mensagem: string;
        parcelaInfo: import("@prisma/client/runtime/library").JsonValue | null;
        anexos: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    exportarDados(formato: string, query: QueryInadimplenciaDto): Promise<{
        data: Buffer<ArrayBuffer>;
        tipo: string;
        nome: string;
    }>;
}
