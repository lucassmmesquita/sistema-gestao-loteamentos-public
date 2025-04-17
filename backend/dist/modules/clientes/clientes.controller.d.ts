import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { QueryClienteDto } from './dto/query-cliente.dto';
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    create(createClienteDto: CreateClienteDto): Promise<{
        endereco: import("@prisma/client/runtime").GetResult<{
            id: number;
            clienteId: number;
            cep: string;
            logradouro: string;
            numero: string;
            complemento: string;
            bairro: string;
            cidade: string;
            estado: string;
        }, unknown, never> & {};
        contatos: import("@prisma/client/runtime").GetResult<{
            id: number;
            clienteId: number;
            telefones: string[];
            emails: string[];
        }, unknown, never> & {};
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        nome: string;
        cpfCnpj: string;
        dataNascimento: Date;
        dataCadastro: Date;
    }, unknown, never> & {}>;
    findAll(query: QueryClienteDto): Promise<({
        endereco: import("@prisma/client/runtime").GetResult<{
            id: number;
            clienteId: number;
            cep: string;
            logradouro: string;
            numero: string;
            complemento: string;
            bairro: string;
            cidade: string;
            estado: string;
        }, unknown, never> & {};
        contatos: import("@prisma/client/runtime").GetResult<{
            id: number;
            clienteId: number;
            telefones: string[];
            emails: string[];
        }, unknown, never> & {};
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        nome: string;
        cpfCnpj: string;
        dataNascimento: Date;
        dataCadastro: Date;
    }, unknown, never> & {})[]>;
    findOne(id: number): Promise<{
        endereco: import("@prisma/client/runtime").GetResult<{
            id: number;
            clienteId: number;
            cep: string;
            logradouro: string;
            numero: string;
            complemento: string;
            bairro: string;
            cidade: string;
            estado: string;
        }, unknown, never> & {};
        contatos: import("@prisma/client/runtime").GetResult<{
            id: number;
            clienteId: number;
            telefones: string[];
            emails: string[];
        }, unknown, never> & {};
        documentos: (import("@prisma/client/runtime").GetResult<{
            id: number;
            clienteId: number;
            tipo: string;
            nome: string;
            arquivo: string;
            dataUpload: Date;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        nome: string;
        cpfCnpj: string;
        dataNascimento: Date;
        dataCadastro: Date;
    }, unknown, never> & {}>;
    update(id: number, updateClienteDto: UpdateClienteDto): Promise<{
        endereco: import("@prisma/client/runtime").GetResult<{
            id: number;
            clienteId: number;
            cep: string;
            logradouro: string;
            numero: string;
            complemento: string;
            bairro: string;
            cidade: string;
            estado: string;
        }, unknown, never> & {};
        contatos: import("@prisma/client/runtime").GetResult<{
            id: number;
            clienteId: number;
            telefones: string[];
            emails: string[];
        }, unknown, never> & {};
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        nome: string;
        cpfCnpj: string;
        dataNascimento: Date;
        dataCadastro: Date;
    }, unknown, never> & {}>;
    remove(id: number): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        nome: string;
        cpfCnpj: string;
        dataNascimento: Date;
        dataCadastro: Date;
    }, unknown, never> & {}>;
}
