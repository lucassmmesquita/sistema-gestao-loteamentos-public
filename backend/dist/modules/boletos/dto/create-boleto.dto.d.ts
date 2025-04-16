export declare class CreateBoletoDto {
    clienteId: number;
    clienteNome: string;
    contratoId: number;
    valor: number;
    dataVencimento: Date;
    numeroParcela: number;
    descricao: string;
    nossoNumero?: string;
    linhaDigitavel?: string;
    codigoBarras?: string;
    pdfUrl?: string;
}
