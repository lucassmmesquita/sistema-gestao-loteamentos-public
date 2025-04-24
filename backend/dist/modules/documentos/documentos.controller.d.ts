/// <reference types="multer" />
import { DocumentosService } from './documentos.service';
export declare class DocumentosController {
    private readonly documentosService;
    constructor(documentosService: DocumentosService);
    create(createDocumentoDto: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        tipo: string;
        nome: string;
        arquivo: string;
        dataUpload: Date;
        s3Key: string;
    }, unknown, never> & {}>;
    findAll(clienteId?: string): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        tipo: string;
        nome: string;
        arquivo: string;
        dataUpload: Date;
        s3Key: string;
    }, unknown, never> & {})[]>;
    findOne(id: number): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        tipo: string;
        nome: string;
        arquivo: string;
        dataUpload: Date;
        s3Key: string;
    }, unknown, never> & {}>;
    remove(id: number): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        tipo: string;
        nome: string;
        arquivo: string;
        dataUpload: Date;
        s3Key: string;
    }, unknown, never> & {}>;
    upload(file: Express.Multer.File, clienteId: number, tipoDocumento: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        tipo: string;
        nome: string;
        arquivo: string;
        dataUpload: Date;
        s3Key: string;
    }, unknown, never> & {}>;
}
