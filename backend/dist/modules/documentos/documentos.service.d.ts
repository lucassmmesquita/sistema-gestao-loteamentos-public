/// <reference types="multer" />
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
export declare class DocumentosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createDocumentoDto: CreateDocumentoDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        tipo: string;
        nome: string;
        arquivo: string;
        dataUpload: Date;
        s3Key: string;
    }, unknown, never> & {}>;
    findAll(clienteId?: number): Promise<(import("@prisma/client/runtime").GetResult<{
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
    update(id: number, updateDocumentoDto: UpdateDocumentoDto): Promise<import("@prisma/client/runtime").GetResult<{
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
    uploadFile(clienteId: number, file: Express.Multer.File, tipoDocumento: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        tipo: string;
        nome: string;
        arquivo: string;
        dataUpload: Date;
        s3Key: string;
    }, unknown, never> & {}>;
}
