export declare class EnderecoDto {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
}
export declare class ContatoDto {
    telefones: string[];
    emails: string[];
}
export declare class CreateClienteDto {
    nome: string;
    cpfCnpj: string;
    dataNascimento?: string;
    endereco?: EnderecoDto;
    contatos?: ContatoDto;
}
