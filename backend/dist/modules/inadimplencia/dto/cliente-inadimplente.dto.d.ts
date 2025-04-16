export declare class ParcelaInadimplenteDto {
    numero: number;
    dataVencimento: Date;
    valor: number;
    valorAtualizado: number;
    status: string;
}
export declare class CreateClienteInadimplenteDto {
    clienteId: number;
    contratoId: number;
    valorEmAberto: number;
    diasAtraso: number;
    ultimaCobranca?: Date;
    status: string;
    parcelas: ParcelaInadimplenteDto[];
}
