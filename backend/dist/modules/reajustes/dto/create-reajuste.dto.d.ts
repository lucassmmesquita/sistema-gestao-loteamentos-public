export declare class CreateReajusteDto {
    contratoId: number;
    parcelaReferencia: number;
    valorOriginal: number;
    valorReajustado: number;
    indiceAplicado: number;
    indiceBase: string;
    percentualAdicional: number;
    reajusteTotal: number;
    dataReferencia: string;
    dataAplicacao?: string;
    status: string;
    aplicado: boolean;
}
