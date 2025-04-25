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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LotesService = class LotesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createLoteDto) {
        return this.prisma.lote.create({
            data: createLoteDto
        });
    }
    async importLotes(importLotesDto) {
        const results = [];
        for (const loteDto of importLotesDto) {
            try {
                const existingLote = await this.prisma.lote.findFirst({
                    where: {
                        chave: loteDto.chave
                    }
                });
                if (existingLote) {
                    const updatedLote = await this.prisma.lote.update({
                        where: { id: existingLote.id },
                        data: {
                            numero: String(loteDto.lote),
                            quadra: String(loteDto.quadra),
                            area: loteDto.area,
                            chave: loteDto.chave
                        }
                    });
                    results.push({ status: 'updated', lote: updatedLote });
                }
                else {
                    const newLote = await this.prisma.lote.create({
                        data: {
                            numero: String(loteDto.lote),
                            quadra: String(loteDto.quadra),
                            area: loteDto.area,
                            chave: loteDto.chave,
                            loteamento: 'Importado',
                            valorBase: 0,
                            status: 'disponivel'
                        }
                    });
                    results.push({ status: 'created', lote: newLote });
                }
            }
            catch (error) {
                results.push({ status: 'error', chave: loteDto.chave, error: error.message });
            }
        }
        return {
            total: importLotesDto.length,
            processed: results.length,
            results
        };
    }
    async findAll(query) {
        const filters = {};
        if (query.status) {
            filters['status'] = query.status;
        }
        if (query.quadra) {
            filters['quadra'] = query.quadra;
        }
        if (query.numero) {
            filters['numero'] = {
                contains: query.numero,
                mode: 'insensitive'
            };
        }
        if (query.loteamento) {
            filters['loteamento'] = {
                contains: query.loteamento,
                mode: 'insensitive'
            };
        }
        if (query.areaMinima || query.areaMaxima) {
            filters['area'] = {};
            if (query.areaMinima) {
                filters['area']['gte'] = query.areaMinima;
            }
            if (query.areaMaxima) {
                filters['area']['lte'] = query.areaMaxima;
            }
        }
        if (query.valorMinimo || query.valorMaximo) {
            filters['valorBase'] = {};
            if (query.valorMinimo) {
                filters['valorBase']['gte'] = query.valorMinimo;
            }
            if (query.valorMaximo) {
                filters['valorBase']['lte'] = query.valorMaximo;
            }
        }
        return this.prisma.lote.findMany({
            where: filters
        });
    }
    async findOne(id) {
        const lote = await this.prisma.lote.findUnique({
            where: { id },
            include: {
                contratos: {
                    include: {
                        cliente: {
                            select: {
                                id: true,
                                nome: true,
                                cpfCnpj: true
                            }
                        }
                    }
                }
            }
        });
        if (!lote) {
            throw new common_1.NotFoundException(`Lote ID ${id} não encontrado`);
        }
        return lote;
    }
    async update(id, updateLoteDto) {
        await this.findOne(id);
        return this.prisma.lote.update({
            where: { id },
            data: updateLoteDto
        });
    }
    async remove(id) {
        const lote = await this.findOne(id);
        if (lote.contratos.length > 0) {
            throw new Error(`Não é possível excluir o lote, pois ele está vinculado a contratos`);
        }
        return this.prisma.lote.delete({
            where: { id }
        });
    }
    async getLotesDisponiveis() {
        return this.prisma.lote.findMany({
            where: { status: 'disponivel' }
        });
    }
    async getLotesByQuadra(quadra) {
        return this.prisma.lote.findMany({
            where: { quadra }
        });
    }
    async getLotesByLoteamento(loteamento) {
        return this.prisma.lote.findMany({
            where: {
                loteamento: {
                    contains: loteamento,
                    mode: 'insensitive'
                }
            }
        });
    }
};
LotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LotesService);
exports.LotesService = LotesService;
//# sourceMappingURL=lotes.service.js.map