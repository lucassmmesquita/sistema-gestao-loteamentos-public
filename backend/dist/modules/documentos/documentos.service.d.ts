import { PrismaService } from '../../prisma/prisma.service';
export declare class DocumentosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        clienteId: number;
        tipo: string;
        nome: string;
        arquivo: string;
    }): Promise<import("@prisma/client/runtime").GetResult<{
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
    remove(id: number): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        clienteId: number;
        tipo: string;
        nome: string;
        arquivo: string;
        dataUpload: Date;
        s3Key: string;
    }, unknown, never> & {}>;
}
