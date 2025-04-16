import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ContratosService } from './contratos.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { QueryContratoDto } from './dto/query-contrato.dto';

@Controller('contratos')
export class ContratosController {
  constructor(private readonly contratosService: ContratosService) {}

  @Post()
  create(@Body() createContratoDto: CreateContratoDto) {
    return this.contratosService.create(createContratoDto);
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
}