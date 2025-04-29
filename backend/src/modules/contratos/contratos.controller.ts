// backend/src/modules/contratos/contratos.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ContratosService } from './contratos.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { QueryContratoDto } from './dto/query-contrato.dto';
import { ImportContratoDto } from './dto/import-contrato.dto';
import { AprovarContratoDto } from './dto/aprovar-contrato.dto';
import { OficializarContratoDto } from './dto/oficializar-contrato.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('contratos')
export class ContratosController {
  constructor(private readonly contratosService: ContratosService) {}

  @Post('import')
  importContratos(@Body() importContratosDto: ImportContratoDto[]) {
    return this.contratosService.importContratos(importContratosDto);
  }

  @Post()
  create(@Body() createContratoDto: CreateContratoDto) {
    return this.contratosService.create(createContratoDto);
  }

  @Get('lote/:loteId')
  getByLoteId(@Param('loteId', ParseIntPipe) loteId: number) {
    return this.contratosService.getByLoteId(loteId);
  }

  @Get()
  findAll(@Query() query: QueryContratoDto) {
    return this.contratosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contratosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContratoDto: UpdateContratoDto,
  ) {
    return this.contratosService.update(id, updateContratoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contratosService.remove(id);
  }

  @Get('cliente/:clienteId')
  getByClienteId(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return this.contratosService.getByClienteId(clienteId);
  }

  @Get('lotes/disponiveis')
  getLotesDisponiveis() {
    return this.contratosService.getLotesDisponiveis();
  }

  @Post('previa')
  gerarPrevia(@Body() contratoDto: CreateContratoDto) {
    return this.contratosService.gerarPrevia(contratoDto);
  }

  @Patch(':id/aprovar')
  @UseGuards(JwtAuthGuard)
  aprovarContrato(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() aprovarContratoDto: AprovarContratoDto
  ) {
    return this.contratosService.aprovarContrato(id, req.user.id, aprovarContratoDto);
  }

  @Patch(':id/oficializar')
  @UseGuards(JwtAuthGuard)
  oficializarContrato(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() oficializarContratoDto: OficializarContratoDto
  ) {
    return this.contratosService.oficializarContrato(id, req.user.id, oficializarContratoDto);
  }

  @Get('vendedor/meus')
  @UseGuards(JwtAuthGuard)
  getContratosByVendedor(@Request() req) {
    return this.contratosService.getContratosByVendedor(req.user.id);
  }

  @Get('proprietario/meus')
  @UseGuards(JwtAuthGuard)
  getContratosByProprietario(@Request() req) {
    return this.contratosService.getContratosByProprietario(req.user.id);
  }
}