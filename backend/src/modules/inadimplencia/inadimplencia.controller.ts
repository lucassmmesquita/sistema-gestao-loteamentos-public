// backend/src/modules/inadimplencia/inadimplencia.controller.ts

import { Controller, Get, Post, Body, Param, Query, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { InadimplenciaService } from './inadimplencia.service';
import { QueryInadimplenciaDto } from './dto/query-inadimplencia.dto';
import { RegistrarInteracaoDto } from './dto/registrar-interacao.dto';
import { EnviarComunicacaoDto } from './dto/enviar-comunicacao.dto';
import { GerarBoletoDto } from './dto/gerar-boleto.dto';
import { SalvarGatilhosDto } from './dto/salvar-gatilhos.dto';

@Controller('inadimplencia')
export class InadimplenciaController {
  constructor(private readonly inadimplenciaService: InadimplenciaService) {}

  @Get('clientes')
  listarClientesInadimplentes(@Query() query: QueryInadimplenciaDto) {
    return this.inadimplenciaService.listarClientesInadimplentes(query);
  }

  @Get('clientes/:id')
  obterClienteInadimplente(@Param('id', ParseIntPipe) id: number) {
    return this.inadimplenciaService.obterClienteInadimplente(id);
  }

  @Get('clientes/:id/interacoes')
  obterHistoricoInteracoes(@Param('id', ParseIntPipe) id: number) {
    return this.inadimplenciaService.obterHistoricoInteracoes(id);
  }

  @Post('clientes/:id/interacoes')
  registrarInteracao(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: RegistrarInteracaoDto,
  ) {
    return this.inadimplenciaService.registrarInteracao(id, dados);
  }

  @Get('clientes/:id/comunicacoes')
  obterHistoricoComunicacoes(@Param('id', ParseIntPipe) id: number) {
    return this.inadimplenciaService.obterHistoricoComunicacoes(id);
  }

  @Post('comunicacao/enviar')
  enviarComunicacao(@Body() dados: EnviarComunicacaoDto) {
    return this.inadimplenciaService.enviarComunicacao(dados);
  }

  @Post('clientes/:clienteId/parcelas/:parcelaId/boleto')
  gerarNovoBoleto(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Param('parcelaId', ParseIntPipe) parcelaId: number,
    @Body() dados: GerarBoletoDto,
  ) {
    return this.inadimplenciaService.gerarNovoBoleto(clienteId, parcelaId, dados);
  }

  @Get('configuracoes/gatilhos')
  obterGatilhos() {
    return this.inadimplenciaService.obterGatilhos();
  }

  @Put('configuracoes/gatilhos')
  salvarGatilhos(@Body() dados: SalvarGatilhosDto) {
    return this.inadimplenciaService.salvarGatilhos(dados);
  }

  @Post('comunicacao/automatica')
  enviarCobrancaAutomatica(@Body() dados: any) {
    return this.inadimplenciaService.enviarCobrancaAutomatica(dados);
  }

  @Get('exportar')
  exportarDados(@Query('formato') formato: string, @Query() filtros: QueryInadimplenciaDto) {
    return this.inadimplenciaService.exportarDados(formato, filtros);
  }
}