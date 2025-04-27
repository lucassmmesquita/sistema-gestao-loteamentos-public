import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ParcelasService } from './parcelas.service';
import { CreateParcelaDto } from './dto/create-parcela.dto';
import { UpdateParcelaDto } from './dto/update-parcela.dto';
import { PagamentoParcelaDto } from './dto/pagamento-parcela.dto';

@Controller('parcelas')
export class ParcelasController {
  constructor(private readonly parcelasService: ParcelasService) {}

  @Post()
  create(@Body() createParcelaDto: CreateParcelaDto) {
    return this.parcelasService.create(createParcelaDto);
  }

  @Get()
  findAll() {
    return this.parcelasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.parcelasService.findOne(id);
  }

  @Get('contrato/:contratoId')
  findByContrato(@Param('contratoId', ParseIntPipe) contratoId: number) {
    return this.parcelasService.findByContrato(contratoId);
  }

  @Post('gerar/:contratoId')
  gerarParcelas(@Param('contratoId', ParseIntPipe) contratoId: number) {
    return this.parcelasService.gerarParcelas(contratoId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateParcelaDto: UpdateParcelaDto) {
    return this.parcelasService.update(id, updateParcelaDto);
  }

  @Patch(':id/pagamento')
  registrarPagamento(
    @Param('id', ParseIntPipe) id: number,
    @Body() pagamentoDto: PagamentoParcelaDto,
  ) {
    return this.parcelasService.registrarPagamento(id, pagamentoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.parcelasService.remove(id);
  }
}