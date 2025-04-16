import { PrismaService } from '../../prisma/prisma.service';
import { QueryInadimplenciaDto } from './dto/query-inadimplencia.dto';
import { CreateInteracaoDto } from './dto/interacao.dto';
import { CreateComunicacaoDto } from './dto/comunicacao.dto';
import { ConfiguracaoGatilhosDto } from './dto/gatilho.dto';
export declare class InadimplenciaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listarClientesInadimplentes(query: QueryInadimplenciaDto): Promise<({
        cliente: {
            id: number;
            nome: string;
            cpfCnpj: string;
            contatos: {
                id: number;
                clienteId: number;
                telefones: string[];
                emails: string[];
            };
        };
        parcelas: {
            id: number;
            status: string;
            clienteInadimplente_id: number;
            numero: number;
            dataVencimento: Date;
            valor: import("@prisma/client/runtime/library").Decimal;
            valorAtualizado: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: number;
        clienteId: number;
        contratoId: number;
        valorEmAberto: import("@prisma/client/runtime/library").Decimal;
        diasAtraso: number;
        ultimaCobranca: Date | null;
        status: string;
    })[]>;
    obterClienteInadimplente(id: number): Promise<{
        cliente: {
            endereco: {
                id: number;
                clienteId: number;
                numero: string;
                cep: string;
                logradouro: string;
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
        parcelas: {
            id: number;
            status: string;
            clienteInadimplente_id: number;
            numero: number;
            dataVencimento: Date;
            valor: import("@prisma/client/runtime/library").Decimal;
            valorAtualizado: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: number;
        clienteId: number;
        contratoId: number;
        valorEmAberto: import("@prisma/client/runtime/library").Decimal;
        diasAtraso: number;
        ultimaCobranca: Date | null;
        status: string;
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
        dataVencimento: Date;
        valor: import("@prisma/client/runtime/library").Decimal;
        status: string;
    }>;
    obterGatilhos(): Promise<{
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
    } | {
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
        data: string;
        tipo: string;
        nome: string;
    }>;
}
