import { Controller, Get, Post, Body, Patch, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ReajustesService } from './reajustes.service';
import { CreateReajusteDto } from './dto/create-reajuste.dto';
import { UpdateReajusteDto } from './dto/update-reajuste.dto';
import { ParametrosReajusteDto } from './dto/parametros-reajuste.dto';
import { IndicesEconomicosDto } from './dto/indices-economicos.dto';
import { QueryReajusteDto } from './dto/query-reajuste.dto';

@Controller('reajustes')
export class ReajustesController {
  constructor(private readonly reajustesService: ReajustesService) {}

  @Get()
  findAll(@Query() query: QueryReajusteDto) {
    return this.reajustesService.findAll(query);
  }

  @Get('previstos')
  findReajustesPrevistos(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.reajustesService.findReajustesPrevistos(dataInicio, dataFim);
  }

  @Get('parametros')
  findParametrosReajuste() {
    return this.reajustesService.findParametrosReajuste();
  }

  @Patch('parametros')
  updateParametrosReajuste(@Body() parametrosReajusteDto: ParametrosReajusteDto) {
    return this.reajustesService.updateParametrosReajuste(parametrosReajusteDto);
  }

  @Get('indices-economicos')
  findIndicesEconomicos() {
    return this.reajustesService.findIndicesEconomicos();
  }

  @Patch('indices-economicos')
  updateIndicesEconomicos(@Body() indicesEconomicosDto: IndicesEconomicosDto) {
    return this.reajustesService.updateIndicesEconomicos(indicesEconomicosDto);
  }

  @Post('aplicar/:contratoId')
  aplicarReajuste(@Param('contratoId', ParseIntPipe) contratoId: number) {
    return this.reajustesService.aplicarReajuste(contratoId);
  }

  @Post('simular/:contratoId')
  simularReajuste(
    @Param('contratoId', ParseIntPipe) contratoId: number,
    @Body() parametrosOverride: Partial<ParametrosReajusteDto>,
  ) {
    return this.reajustesService.simularReajuste(contratoId, parametrosOverride);
  }

  @Get('historico/:contratoId')
  findHistoricoReajustes(@Param('contratoId', ParseIntPipe) contratoId: number) {
    return this.reajustesService.findHistoricoReajustes(contratoId);
  }

  @Get('relatorio')
  gerarRelatorioReajustes(@Query() query: QueryReajusteDto) {
    return this.reajustesService.gerarRelatorioReajustes(query);
  }
}