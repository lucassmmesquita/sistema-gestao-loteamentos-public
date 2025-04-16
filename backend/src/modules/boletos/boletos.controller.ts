import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { BoletosService } from './boletos.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';

@Controller('boletos')
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}

  @Post()
  gerarBoleto(@Body() createBoletoDto: CreateBoletoDto) {
    return this.boletosService.gerarBoleto(createBoletoDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.boletosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.boletosService.findOne(id);
  }

  @Patch(':id/cancelar')
  cancelarBoleto(@Param('id', ParseIntPipe) id: number) {
    return this.boletosService.cancel(id);
  }

  @Patch(':id/pagamento')
  registrarPagamento(
    @Param('id', ParseIntPipe) id: number,
    @Body() dadosPagamento: any,
  ) {
    return this.boletosService.registrarPagamento(id, dadosPagamento);
  }

  @Post('pagamentos/lote')
  registrarPagamentosEmLote(@Body() pagamentos: any[]) {
    //return this.boletosService.registrarPagamentosEmLote(pagamentos);
  }

  @Patch('status/arquivo-retorno')
  atualizarStatusPorArquivoRetorno(@Body() registros: any[]) {
    //return this.boletosService.atualizarStatusPorArquivoRetorno(registros);
  }
}