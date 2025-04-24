export declare class CreateDocumentoDto {
    clienteId: number;
    tipo: string;
    nome: string;
    arquivo: string;
    dataUpload?: Date;
    s3Key?: string;
}
