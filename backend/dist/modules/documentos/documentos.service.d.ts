import { PrismaService } from '../../prisma/prisma.service';
import { CreateAditivoDto } from './dto/create-aditivo.dto';
import { UpdateAditivoDto } from './dto/update-aditivo.dto';
import { CreateDistratoDto } from './dto/create-distrato.dto';
import { UpdateDistratoDto } from './dto/update-distrato.dto';
import { CreateQuitacaoDto } from './dto/create-quitacao.dto';
import { UpdateQuitacaoDto } from './dto/update-quitacao.dto';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
export declare class DocumentosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createAditivo(createAditivoDto: CreateAditivoDto): Promise<{
        id: number;
        contratoId: number;
        tipo: string;
        dataAssinatura: Date;
        motivoAditivo: string;
        novoValor: import("@prisma/client/runtime/library").Decimal | null;
        novaDataFim: Date | null;
        documentoUrl: string | null;
        status: string;
    }>;
    findAllAditivos(contratoId?: number): Promise<({
        contrato: {
            id: number;
            clienteId: number;
            cliente: {
                id: number;
                nome: string;
                cpfCnpj: string;
            };
        };
    } & {
        id: number;
        contratoId: number;
        tipo: string;
        dataAssinatura: Date;
        motivoAditivo: string;
        novoValor: import("@prisma/client/runtime/library").Decimal | null;
        novaDataFim: Date | null;
        documentoUrl: string | null;
        status: string;
    })[]>;
    findOneAditivo(id: number): Promise<{
        contrato: {
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
        };
    } & {
        id: number;
        contratoId: number;
        tipo: string;
        dataAssinatura: Date;
        motivoAditivo: string;
        novoValor: import("@prisma/client/runtime/library").Decimal | null;
        novaDataFim: Date | null;
        documentoUrl: string | null;
        status: string;
    }>;
    updateAditivo(id: number, updateAditivoDto: UpdateAditivoDto): Promise<{
        id: number;
        contratoId: number;
        tipo: string;
        dataAssinatura: Date;
        motivoAditivo: string;
        novoValor: import("@prisma/client/runtime/library").Decimal | null;
        novaDataFim: Date | null;
        documentoUrl: string | null;
        status: string;
    }>;
    removeAditivo(id: number): Promise<{
        id: number;
        contratoId: number;
        tipo: string;
        dataAssinatura: Date;
        motivoAditivo: string;
        novoValor: import("@prisma/client/runtime/library").Decimal | null;
        novaDataFim: Date | null;
        documentoUrl: string | null;
        status: string;
    }>;
    createDistrato(createDistratoDto: CreateDistratoDto): Promise<{
        id: number;
        contratoId: number;
        documentoUrl: string | null;
        dataDistrato: Date;
        motivoDistrato: string;
        valorDevolucao: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    findAllDistratos(contratoId?: number): Promise<({
        contrato: {
            id: number;
            clienteId: number;
            cliente: {
                id: number;
                nome: string;
                cpfCnpj: string;
            };
        };
    } & {
        id: number;
        contratoId: number;
        documentoUrl: string | null;
        dataDistrato: Date;
        motivoDistrato: string;
        valorDevolucao: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    findOneDistrato(id: number): Promise<{
        contrato: {
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
        };
    } & {
        id: number;
        contratoId: number;
        documentoUrl: string | null;
        dataDistrato: Date;
        motivoDistrato: string;
        valorDevolucao: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    updateDistrato(id: number, updateDistratoDto: UpdateDistratoDto): Promise<{
        id: number;
        contratoId: number;
        documentoUrl: string | null;
        dataDistrato: Date;
        motivoDistrato: string;
        valorDevolucao: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    removeDistrato(id: number): Promise<{
        id: number;
        contratoId: number;
        documentoUrl: string | null;
        dataDistrato: Date;
        motivoDistrato: string;
        valorDevolucao: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    createQuitacao(createQuitacaoDto: CreateQuitacaoDto): Promise<{
        id: number;
        contratoId: number;
        documentoUrl: string | null;
        dataQuitacao: Date;
        valorQuitacao: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAllQuitacoes(contratoId?: number): Promise<({
        contrato: {
            id: number;
            clienteId: number;
            cliente: {
                id: number;
                nome: string;
                cpfCnpj: string;
            };
        };
    } & {
        id: number;
        contratoId: number;
        documentoUrl: string | null;
        dataQuitacao: Date;
        valorQuitacao: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findOneQuitacao(id: number): Promise<{
        contrato: {
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
        };
    } & {
        id: number;
        contratoId: number;
        documentoUrl: string | null;
        dataQuitacao: Date;
        valorQuitacao: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateQuitacao(id: number, updateQuitacaoDto: UpdateQuitacaoDto): Promise<{
        id: number;
        contratoId: number;
        documentoUrl: string | null;
        dataQuitacao: Date;
        valorQuitacao: import("@prisma/client/runtime/library").Decimal;
    }>;
    removeQuitacao(id: number): Promise<{
        id: number;
        contratoId: number;
        documentoUrl: string | null;
        dataQuitacao: Date;
        valorQuitacao: import("@prisma/client/runtime/library").Decimal;
    }>;
    createDocumento(createDocumentoDto: CreateDocumentoDto): Promise<{
        id: number;
        tipo: string;
        clienteId: number;
        nome: string;
        arquivo: string;
        dataUpload: Date;
    }>;
    uploadDocumento(contratoId: number, tipo: string, file: any): Promise<{
        id: number;
        tipo: string;
        clienteId: number;
        nome: string;
        arquivo: string;
        dataUpload: Date;
    }>;
    findAllDocumentos(contratoId?: number): Promise<({
        cliente: {
            id: number;
            nome: string;
            cpfCnpj: string;
        };
    } & {
        id: number;
        tipo: string;
        clienteId: number;
        nome: string;
        arquivo: string;
        dataUpload: Date;
    })[]>;
    findOneDocumento(id: number): Promise<{
        cliente: {
            id: number;
            nome: string;
            cpfCnpj: string;
        };
    } & {
        id: number;
        tipo: string;
        clienteId: number;
        nome: string;
        arquivo: string;
        dataUpload: Date;
    }>;
    updateDocumento(id: number, updateDocumentoDto: UpdateDocumentoDto): Promise<{
        id: number;
        tipo: string;
        clienteId: number;
        nome: string;
        arquivo: string;
        dataUpload: Date;
    }>;
    removeDocumento(id: number): Promise<{
        id: number;
        tipo: string;
        clienteId: number;
        nome: string;
        arquivo: string;
        dataUpload: Date;
    }>;
}
