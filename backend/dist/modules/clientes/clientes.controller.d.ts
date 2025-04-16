import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { QueryClienteDto } from './dto/query-cliente.dto';
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    create(createClienteDto: CreateClienteDto): Promise<{
        endereco: {
            cep: string;
            logradouro: string;
            numero: string;
            complemento: string | null;
            bairro: string;
            cidade: string;
            estado: string;
            id: number;
            clienteId: number;
        };
        contatos: {
            telefones: string[];
            emails: string[];
            id: number;
            clienteId: number;
        };
    } & {
        nome: string;
        cpfCnpj: string;
        dataNascimento: Date | null;
        id: number;
        dataCadastro: Date;
    }>;
    findAll(query: QueryClienteDto): Promise<({
        endereco: {
            cep: string;
            logradouro: string;
            numero: string;
            complemento: string | null;
            bairro: string;
            cidade: string;
            estado: string;
            id: number;
            clienteId: number;
        };
        contatos: {
            telefones: string[];
            emails: string[];
            id: number;
            clienteId: number;
        };
    } & {
        nome: string;
        cpfCnpj: string;
        dataNascimento: Date | null;
        id: number;
        dataCadastro: Date;
    })[]>;
    findOne(id: number): Promise<{
        endereco: {
            cep: string;
            logradouro: string;
            numero: string;
            complemento: string | null;
            bairro: string;
            cidade: string;
            estado: string;
            id: number;
            clienteId: number;
        };
        contatos: {
            telefones: string[];
            emails: string[];
            id: number;
            clienteId: number;
        };
        documentos: {
            nome: string;
            id: number;
            clienteId: number;
            tipo: string;
            arquivo: string;
            dataUpload: Date;
        }[];
    } & {
        nome: string;
        cpfCnpj: string;
        dataNascimento: Date | null;
        id: number;
        dataCadastro: Date;
    }>;
    update(id: number, updateClienteDto: UpdateClienteDto): Promise<{
        endereco: {
            cep: string;
            logradouro: string;
            numero: string;
            complemento: string | null;
            bairro: string;
            cidade: string;
            estado: string;
            id: number;
            clienteId: number;
        };
        contatos: {
            telefones: string[];
            emails: string[];
            id: number;
            clienteId: number;
        };
    } & {
        nome: string;
        cpfCnpj: string;
        dataNascimento: Date | null;
        id: number;
        dataCadastro: Date;
    }>;
    remove(id: number): Promise<{
        nome: string;
        cpfCnpj: string;
        dataNascimento: Date | null;
        id: number;
        dataCadastro: Date;
    }>;
}
