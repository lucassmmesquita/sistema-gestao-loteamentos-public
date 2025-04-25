import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { LotesService } from './lotes.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { QueryLoteDto } from './dto/query-lote.dto';
import { ImportLoteDto } from './dto/import-lote.dto';
 
@Controller('lotes')
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  @Post('import')
  importLotes(@Body() importLotesDto: ImportLoteDto[]) {
  return this.lotesService.importLotes(importLotesDto);
  }
  @Post()
  create(@Body() createLoteDto: CreateLoteDto) {
    return this.lotesService.create(createLoteDto);
  }

  @Get()
  findAll(@Query() query: QueryLoteDto) {
    return this.lotesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lotesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLoteDto: UpdateLoteDto,
  ) {
    return this.lotesService.update(id, updateLoteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lotesService.remove(id);
  }

  @Get('status/disponiveis')
  getLotesDisponiveis() {
    return this.lotesService.getLotesDisponiveis();
  }

  @Get('quadra/:quadra')
  getLotesByQuadra(@Param('quadra') quadra: string) {
    return this.lotesService.getLotesByQuadra(quadra);
  }

  @Get('loteamento/:loteamento')
  getLotesByLoteamento(@Param('loteamento') loteamento: string) {
    return this.lotesService.getLotesByLoteamento(loteamento);
  }

}