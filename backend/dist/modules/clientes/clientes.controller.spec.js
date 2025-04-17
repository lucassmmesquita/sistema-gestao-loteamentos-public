"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const clientes_controller_1 = require("./clientes.controller");
const clientes_service_1 = require("./clientes.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
describe('ClientesController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [clientes_controller_1.ClientesController],
            providers: [
                clientes_service_1.ClientesService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: {
                        cliente: {
                            findMany: jest.fn().mockResolvedValue([]),
                            findUnique: jest.fn().mockResolvedValue(null),
                            create: jest.fn().mockImplementation(dto => Promise.resolve(Object.assign({ id: 1 }, dto.data))),
                            update: jest.fn().mockImplementation((params) => Promise.resolve(Object.assign({ id: params.where.id }, params.data))),
                            delete: jest.fn().mockResolvedValue({ id: 1 })
                        },
                        documento: {
                            create: jest.fn().mockImplementation(dto => Promise.resolve(Object.assign({ id: 1 }, dto.data)))
                        }
                    }
                }
            ],
        }).compile();
        controller = module.get(clientes_controller_1.ClientesController);
        service = module.get(clientes_service_1.ClientesService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('should create a cliente', async () => {
            const createClienteDto = {
                nome: 'Test Cliente',
                cpfCnpj: '12345678901',
                dataNascimento: '2000-01-01',
                endereco: {
                    cep: '12345678',
                    logradouro: 'Rua Teste',
                    numero: '123',
                    bairro: 'Bairro Teste',
                    cidade: 'Cidade Teste',
                    estado: 'ST'
                },
                contatos: {
                    telefones: ['1234567890'],
                    emails: ['test@example.com']
                }
            };
            jest.spyOn(service, 'create').mockResolvedValue(Object.assign(Object.assign({ id: 1 }, createClienteDto), { dataCadastro: new Date() }));
            const result = await controller.create(createClienteDto);
            expect(result.nome).toBe(createClienteDto.nome);
            expect(result.cpfCnpj).toBe(createClienteDto.cpfCnpj);
        });
        it('should handle duplicate CPF/CNPJ error', async () => {
            const createClienteDto = {
                nome: 'Test Cliente',
                cpfCnpj: '12345678901',
                dataNascimento: '2000-01-01',
                endereco: {
                    cep: '12345678',
                    logradouro: 'Rua Teste',
                    numero: '123',
                    bairro: 'Bairro Teste',
                    cidade: 'Cidade Teste',
                    estado: 'ST'
                },
                contatos: {
                    telefones: ['1234567890'],
                    emails: ['test@example.com']
                }
            };
            const prismaError = {
                code: 'P2002',
                meta: { target: ['cpfCnpj'] },
                message: 'Unique constraint failed on the fields: (`cpfCnpj`)'
            };
            jest.spyOn(service, 'create').mockRejectedValue(prismaError);
            await expect(controller.create(createClienteDto)).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('findAll', () => {
        it('should return an array of clientes', async () => {
            const mockClientes = [
                {
                    id: 1,
                    nome: 'Cliente 1',
                    cpfCnpj: '12345678901',
                    dataNascimento: '2000-01-01',
                    dataCadastro: new Date(),
                    endereco: {
                        id: 1,
                        clienteId: 1,
                        cep: '12345678',
                        logradouro: 'Rua A',
                        numero: '123',
                        bairro: 'Centro',
                        cidade: 'São Paulo',
                        estado: 'SP'
                    },
                    contatos: {
                        id: 1,
                        clienteId: 1,
                        telefones: ['11999999999'],
                        emails: ['cliente1@example.com']
                    }
                }
            ];
            jest.spyOn(service, 'findAll').mockResolvedValue(mockClientes);
            const query = {};
            const result = await controller.findAll(query);
            expect(result).toBe(mockClientes);
            expect(service.findAll).toHaveBeenCalledWith(query);
        });
    });
    describe('findOne', () => {
        it('should return a cliente by id', async () => {
            const clienteId = 1;
            const mockCliente = {
                id: clienteId,
                nome: 'Cliente 1',
                cpfCnpj: '12345678901',
                dataNascimento: '2000-01-01',
                dataCadastro: new Date(),
                endereco: {
                    id: 1,
                    clienteId: 1,
                    cep: '12345678',
                    logradouro: 'Rua A',
                    numero: '123',
                    bairro: 'Centro',
                    cidade: 'São Paulo',
                    estado: 'SP'
                },
                contatos: {
                    id: 1,
                    clienteId: 1,
                    telefones: ['11999999999'],
                    emails: ['cliente1@example.com']
                },
                documentos: []
            };
            jest.spyOn(service, 'findOne').mockResolvedValue(mockCliente);
            const result = await controller.findOne(clienteId);
            expect(result).toBe(mockCliente);
            expect(service.findOne).toHaveBeenCalledWith(clienteId);
        });
    });
});
//# sourceMappingURL=clientes.controller.spec.js.map