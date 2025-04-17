"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ClientesService = class ClientesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createClienteDto) {
        const { endereco, contatos } = createClienteDto, clienteData = __rest(createClienteDto, ["endereco", "contatos"]);
        const dataProcessada = Object.assign(Object.assign({}, clienteData), { dataNascimento: clienteData.dataNascimento
                ? new Date(clienteData.dataNascimento)
                : clienteData.dataNascimento });
        return this.prisma.cliente.create({
            data: Object.assign(Object.assign({}, dataProcessada), { endereco: endereco ? {
                    create: endereco
                } : undefined, contatos: contatos ? {
                    create: contatos
                } : undefined }),
            include: {
                endereco: true,
                contatos: true
            }
        });
    }
    async findAll(query) {
        const filters = {};
        if (query.nome) {
            filters['nome'] = {
                contains: query.nome,
                mode: 'insensitive'
            };
        }
        if (query.cpfCnpj) {
            filters['cpfCnpj'] = {
                contains: query.cpfCnpj
            };
        }
        if (query.cidade || query.estado) {
            filters['endereco'] = {};
            if (query.cidade) {
                filters['endereco']['cidade'] = {
                    contains: query.cidade,
                    mode: 'insensitive'
                };
            }
            if (query.estado) {
                filters['endereco']['estado'] = query.estado;
            }
        }
        return this.prisma.cliente.findMany({
            where: filters,
            include: {
                endereco: true,
                contatos: true
            }
        });
    }
    async findOne(id) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id },
            include: {
                endereco: true,
                contatos: true,
                documentos: true
            }
        });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente ID ${id} não encontrado`);
        }
        return cliente;
    }
    async update(id, updateClienteDto) {
        const { endereco, contatos } = updateClienteDto, clienteData = __rest(updateClienteDto, ["endereco", "contatos"]);
        await this.findOne(id);
        const dataProcessada = Object.assign(Object.assign({}, clienteData), { dataNascimento: clienteData.dataNascimento
                ? new Date(clienteData.dataNascimento)
                : clienteData.dataNascimento });
        return this.prisma.cliente.update({
            where: { id },
            data: Object.assign(Object.assign({}, dataProcessada), { endereco: endereco ? {
                    upsert: {
                        create: endereco,
                        update: endereco
                    }
                } : undefined, contatos: contatos ? {
                    upsert: {
                        create: contatos,
                        update: contatos
                    }
                } : undefined }),
            include: {
                endereco: true,
                contatos: true
            }
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.cliente.delete({
            where: { id }
        });
    }
};
ClientesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientesService);
exports.ClientesService = ClientesService;
//# sourceMappingURL=clientes.service.js.map