import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Put } from '@nestjs/common';
import { InadimplenciaService } from './inadimplencia.service';
import { CreateClienteInadimplenteDto } from './dto/cliente-inadimplente.dto';
import { UpdateClienteInadimplenteDto } from './dto/update-cliente-inadimplente.dto';
import { QueryInadimplenciaDto } from './dto/query-inadimplencia.dto';
import { CreateInteracaoDto } from './dto/interacao.dto';
import { CreateComunicacaoDto } from './dto/comunicacao.dto';
import { ConfiguracaoGatilhosDto } from './dto/gatilho.dto';

@Controller('inadimplencia')
export class InadimplenciaController {
  constructor(private readonly inadimplenciaService: InadimplenciaService) {}

  @Get('clientes-inadimplentes')
  listarClientesInadimplentes(@Query() query: QueryInadimplenciaDto) {
    return this.inadimplenciaService.listarClientesInadimplentes(query);
  }

  @Get('clientes-inadimplentes/:id')
  obterClienteInadimplente(@Param('id', ParseIntPipe) id: number) {
    return this.inadimplenciaService.obterClienteInadimplente(id);
  }

  @Post('clientes/:clienteId/interacoes')
  registrarInteracao(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Body() createInteracaoDto: CreateInteracaoDto,
  ) {
    return this.inadimplenciaService.registrarInteracao(clienteId, createInteracaoDto);
  }

  @Get('clientes/:clienteId/interacoes')
  obterHistoricoInteracoes(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return this.inadimplenciaService.obterHistoricoInteracoes(clienteId);
  }

  @Post('clientes/:clienteId/parcelas/:parcelaId/boleto')
  gerarNovoBoleto(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Param('parcelaId') parcelaId: string,
  ) {
    return this.inadimplenciaService.gerarNovoBoleto(clienteId, parcelaId);
  }

  @Get('configuracoes/gatilhos')
  obterGatilhos() {
    return this.inadimplenciaService.obterGatilhos();
  }

  @Put('configuracoes/gatilhos')
  salvarGatilhos(@Body() configuracaoGatilhosDto: ConfiguracaoGatilhosDto) {
    return this.inadimplenciaService.salvarGatilhos(configuracaoGatilhosDto);
  }

  @Post('comunicacao/enviar')
  enviarComunicacao(@Body() createComunicacaoDto: CreateComunicacaoDto) {
    return this.inadimplenciaService.enviarComunicacao(createComunicacaoDto);
  }

  @Get('clientes/:clienteId/comunicacoes')
  obterHistoricoComunicacoes(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return this.inadimplenciaService.obterHistoricoComunicacoes(clienteId);
  }

  @Post('comunicacao/automatica')
  enviarCobrancaAutomatica(
    @Body() data: { clienteId: number; parcelaId: string; gatilho: any },
  ) {
    return this.inadimplenciaService.enviarCobrancaAutomatica(
      data.clienteId,
      data.parcelaId,
      data.gatilho,
    );
  }

  @Get('clientes-inadimplentes/exportar')
  exportarDados(
    @Query('formato') formato: string,
    @Query() query: QueryInadimplenciaDto,
  ) {
    return this.inadimplenciaService.exportarDados(formato, query);
  }
}