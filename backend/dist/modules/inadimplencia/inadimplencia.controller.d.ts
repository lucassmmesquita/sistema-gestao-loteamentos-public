import { InadimplenciaService } from './inadimplencia.service';
import { QueryInadimplenciaDto } from './dto/query-inadimplencia.dto';
import { RegistrarInteracaoDto } from './dto/registrar-interacao.dto';
import { EnviarComunicacaoDto } from './dto/enviar-comunicacao.dto';
import { GerarBoletoDto } from './dto/gerar-boleto.dto';
import { SalvarGatilhosDto } from './dto/salvar-gatilhos.dto';
export declare class InadimplenciaController {
    private readonly inadimplenciaService;
    constructor(inadimplenciaService: InadimplenciaService);
    listarClientesInadimplentes(query: QueryInadimplenciaDto): Promise<{
        id: number;
        cliente: {
            id: number;
            nome: string;
            cpfCnpj: string;
        };
        contratoId: number;
        valorEmAberto: import("@prisma/client/runtime").Decimal;
        diasAtraso: number;
        ultimaCobranca: Date;
        status: string;
        parcelas: (import("@prisma/client/runtime").GetResult<{
            id: number;
            clienteInadimplente_id: number;
            numero: number;
            dataVencimento: Date;
            valor: import("@prisma/client/runtime").Decimal;
            valorAtualizado: import("@prisma/client/runtime").Decimal;
            status: string;
        }, unknown, never> & {})[];
    }[]>;
    obterClienteInadimplente(id: number): Promise<{
        id: number;
        cliente: {
            id: number;
            nome: string;
            cpfCnpj: string;
        };
        contratoId: number;
        valorEmAberto: import("@prisma/client/runtime").Decimal;
        diasAtraso: number;
        ultimaCobranca: Date;
        status: string;
        parcelas: (import("@prisma/client/runtime").GetResult<{
            id: number;
            clienteInadimplente_id: number;
            numero: number;
            dataVencimento: Date;
            valor: import("@prisma/client/runtime").Decimal;
            valorAtualizado: import("@prisma/client/runtime").Decimal;
            status: string;
        }, unknown, never> & {})[];
    }>;
    obterHistoricoInteracoes(id: number): Promise<(import("@prisma/client/runtime").GetResult<{
        id: string;
        clienteId: number;
        tipo: string;
        data: Date;
        observacao: string;
        usuario: string;
        parcelaId: string;
    }, unknown, never> & {})[]>;
    registrarInteracao(id: number, dados: RegistrarInteracaoDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        clienteId: number;
        tipo: string;
        data: Date;
        observacao: string;
        usuario: string;
        parcelaId: string;
    }, unknown, never> & {}>;
    obterHistoricoComunicacoes(id: number): Promise<(import("@prisma/client/runtime").GetResult<{
        id: string;
        clienteId: number;
        tipo: string;
        data: Date;
        mensagem: string;
        status: string;
        parcelaInfo: import(".prisma/client").Prisma.JsonValue;
        anexos: import(".prisma/client").Prisma.JsonValue;
    }, unknown, never> & {})[]>;
    enviarComunicacao(dados: EnviarComunicacaoDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        clienteId: number;
        tipo: string;
        data: Date;
        mensagem: string;
        status: string;
        parcelaInfo: import(".prisma/client").Prisma.JsonValue;
        anexos: import(".prisma/client").Prisma.JsonValue;
    }, unknown, never> & {}>;
    gerarNovoBoleto(clienteId: number, parcelaId: number, dados: GerarBoletoDto): Promise<import("@prisma/client/runtime").GetResult<{
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
        parcelaId: number;
    }, unknown, never> & {}>;
    obterGatilhos(): Promise<import("@prisma/client/runtime").GetResult<{
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
    salvarGatilhos(dados: SalvarGatilhosDto): Promise<import("@prisma/client/runtime").GetResult<{
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
    enviarCobrancaAutomatica(dados: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        clienteId: number;
        tipo: string;
        data: Date;
        mensagem: string;
        status: string;
        parcelaInfo: import(".prisma/client").Prisma.JsonValue;
        anexos: import(".prisma/client").Prisma.JsonValue;
    }, unknown, never> & {}>;
    exportarDados(formato: string, filtros: QueryInadimplenciaDto): Promise<{
        dados: {
            id: number;
            cliente: {
                id: number;
                nome: string;
                cpfCnpj: string;
            };
            contratoId: number;
            valorEmAberto: import("@prisma/client/runtime").Decimal;
            diasAtraso: number;
            ultimaCobranca: Date;
            status: string;
            parcelas: (import("@prisma/client/runtime").GetResult<{
                id: number;
                clienteInadimplente_id: number;
                numero: number;
                dataVencimento: Date;
                valor: import("@prisma/client/runtime").Decimal;
                valorAtualizado: import("@prisma/client/runtime").Decimal;
                status: string;
            }, unknown, never> & {})[];
        }[];
        formato: string;
        dataGeracao: Date;
    }>;
}
