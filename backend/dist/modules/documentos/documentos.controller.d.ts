import { Response } from 'express';
import { DocumentosService } from './documentos.service';
import { CreateAditivoDto } from './dto/create-aditivo.dto';
import { UpdateAditivoDto } from './dto/update-aditivo.dto';
import { CreateDistratoDto } from './dto/create-distrato.dto';
import { UpdateDistratoDto } from './dto/update-distrato.dto';
import { CreateQuitacaoDto } from './dto/create-quitacao.dto';
import { UpdateQuitacaoDto } from './dto/update-quitacao.dto';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
export declare class DocumentosController {
    private readonly documentosService;
    constructor(documentosService: DocumentosService);
    createAditivo(createAditivoDto: CreateAditivoDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        tipo: string;
        dataAssinatura: Date;
        motivoAditivo: string;
        novoValor: import("@prisma/client/runtime").Decimal;
        novaDataFim: Date;
        documentoUrl: string;
        status: string;
    }, unknown, never> & {}>;
    findAllAditivos(contratoId?: string): Promise<({
        contrato: {
            id: number;
            clienteId: number;
            cliente: {
                id: number;
                nome: string;
                cpfCnpj: string;
            };
        };
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        tipo: string;
        dataAssinatura: Date;
        motivoAditivo: string;
        novoValor: import("@prisma/client/runtime").Decimal;
        novaDataFim: Date;
        documentoUrl: string;
        status: string;
    }, unknown, never> & {})[]>;
    findOneAditivo(id: number): Promise<{
        contrato: {
            cliente: {
                id: number;
                nome: string;
                cpfCnpj: string;
            };
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
        }, unknown, never> & {};
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        tipo: string;
        dataAssinatura: Date;
        motivoAditivo: string;
        novoValor: import("@prisma/client/runtime").Decimal;
        novaDataFim: Date;
        documentoUrl: string;
        status: string;
    }, unknown, never> & {}>;
    updateAditivo(id: number, updateAditivoDto: UpdateAditivoDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        tipo: string;
        dataAssinatura: Date;
        motivoAditivo: string;
        novoValor: import("@prisma/client/runtime").Decimal;
        novaDataFim: Date;
        documentoUrl: string;
        status: string;
    }, unknown, never> & {}>;
    removeAditivo(id: number): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        tipo: string;
        dataAssinatura: Date;
        motivoAditivo: string;
        novoValor: import("@prisma/client/runtime").Decimal;
        novaDataFim: Date;
        documentoUrl: string;
        status: string;
    }, unknown, never> & {}>;
    createDistrato(createDistratoDto: CreateDistratoDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        dataDistrato: Date;
        motivoDistrato: string;
        valorDevolucao: import("@prisma/client/runtime").Decimal;
        documentoUrl: string;
    }, unknown, never> & {}>;
    findAllDistratos(contratoId?: string): Promise<({
        contrato: {
            id: number;
            clienteId: number;
            cliente: {
                id: number;
                nome: string;
                cpfCnpj: string;
            };
        };
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        dataDistrato: Date;
        motivoDistrato: string;
        valorDevolucao: import("@prisma/client/runtime").Decimal;
        documentoUrl: string;
    }, unknown, never> & {})[]>;
    findOneDistrato(id: number): Promise<{
        contrato: {
            cliente: {
                id: number;
                nome: string;
                cpfCnpj: string;
            };
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
        }, unknown, never> & {};
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        dataDistrato: Date;
        motivoDistrato: string;
        valorDevolucao: import("@prisma/client/runtime").Decimal;
        documentoUrl: string;
    }, unknown, never> & {}>;
    updateDistrato(id: number, updateDistratoDto: UpdateDistratoDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        dataDistrato: Date;
        motivoDistrato: string;
        valorDevolucao: import("@prisma/client/runtime").Decimal;
        documentoUrl: string;
    }, unknown, never> & {}>;
    removeDistrato(id: number): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        dataDistrato: Date;
        motivoDistrato: string;
        valorDevolucao: import("@prisma/client/runtime").Decimal;
        documentoUrl: string;
    }, unknown, never> & {}>;
    createQuitacao(createQuitacaoDto: CreateQuitacaoDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        dataQuitacao: Date;
        valorQuitacao: import("@prisma/client/runtime").Decimal;
        documentoUrl: string;
    }, unknown, never> & {}>;
    findAllQuitacoes(contratoId?: string): Promise<({
        contrato: {
            id: number;
            clienteId: number;
            cliente: {
                id: number;
                nome: string;
                cpfCnpj: string;
            };
        };
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        dataQuitacao: Date;
        valorQuitacao: import("@prisma/client/runtime").Decimal;
        documentoUrl: string;
    }, unknown, never> & {})[]>;
    findOneQuitacao(id: number): Promise<{
        contrato: {
            cliente: {
                id: number;
                nome: string;
                cpfCnpj: string;
            };
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
        }, unknown, never> & {};
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        dataQuitacao: Date;
        valorQuitacao: import("@prisma/client/runtime").Decimal;
        documentoUrl: string;
    }, unknown, never> & {}>;
    updateQuitacao(id: number, updateQuitacaoDto: UpdateQuitacaoDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        dataQuitacao: Date;
        valorQuitacao: import("@prisma/client/runtime").Decimal;
        documentoUrl: string;
    }, unknown, never> & {}>;
    removeQuitacao(id: number): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        contratoId: number;
        dataQuitacao: Date;
        valorQuitacao: import("@prisma/client/runtime").Decimal;
        documentoUrl: string;
    }, unknown, never> & {}>;
    createDocumento(createDocumentoDto: CreateDocumentoDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        tipo: string;
        nome: string;
        arquivo: string;
        dataUpload: Date;
    }, unknown, never> & {}>;
    uploadDocumento(data: {
        tipo: string;
        contratoId: string;
    }, file: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        tipo: string;
        nome: string;
        arquivo: string;
        dataUpload: Date;
    }, unknown, never> & {}>;
    findAllDocumentos(contratoId?: string): Promise<({
        cliente: {
            id: number;
            nome: string;
            cpfCnpj: string;
        };
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        tipo: string;
        nome: string;
        arquivo: string;
        dataUpload: Date;
    }, unknown, never> & {})[]>;
    findOneDocumento(id: number): Promise<{
        cliente: {
            id: number;
            nome: string;
            cpfCnpj: string;
        };
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        tipo: string;
        nome: string;
        arquivo: string;
        dataUpload: Date;
    }, unknown, never> & {}>;
    downloadDocumento(id: number, res: Response): Promise<void>;
    updateDocumento(id: number, updateDocumentoDto: UpdateDocumentoDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        tipo: string;
        nome: string;
        arquivo: string;
        dataUpload: Date;
    }, unknown, never> & {}>;
    removeDocumento(id: number): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        tipo: string;
        nome: string;
        arquivo: string;
        dataUpload: Date;
    }, unknown, never> & {}>;
}
