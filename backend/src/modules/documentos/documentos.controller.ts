import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile, Res, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DocumentosService } from './documentos.service';
import { CreateAditivoDto } from './dto/create-aditivo.dto';
import { UpdateAditivoDto } from './dto/update-aditivo.dto';
import { CreateDistratoDto } from './dto/create-distrato.dto';
import { UpdateDistratoDto } from './dto/update-distrato.dto';
import { CreateQuitacaoDto } from './dto/create-quitacao.dto';
import { UpdateQuitacaoDto } from './dto/update-quitacao.dto';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  // ADITIVOS
  @Post('aditivos')
  createAditivo(@Body() createAditivoDto: CreateAditivoDto) {
    return this.documentosService.createAditivo(createAditivoDto);
  }

  @Get('aditivos')
  findAllAditivos(@Query('contratoId') contratoId?: string) {
    return this.documentosService.findAllAditivos(contratoId ? parseInt(contratoId) : null);
  }

  @Get('aditivos/:id')
  findOneAditivo(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.findOneAditivo(id);
  }

  @Patch('aditivos/:id')
  updateAditivo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAditivoDto: UpdateAditivoDto,
  ) {
    return this.documentosService.updateAditivo(id, updateAditivoDto);
  }

  @Delete('aditivos/:id')
  removeAditivo(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.removeAditivo(id);
  }

  // DISTRATOS
  @Post('distratos')
  createDistrato(@Body() createDistratoDto: CreateDistratoDto) {
    return this.documentosService.createDistrato(createDistratoDto);
  }

  @Get('distratos')
  findAllDistratos(@Query('contratoId') contratoId?: string) {
    return this.documentosService.findAllDistratos(contratoId ? parseInt(contratoId) : null);
  }

  @Get('distratos/:id')
  findOneDistrato(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.findOneDistrato(id);
  }

  @Patch('distratos/:id')
  updateDistrato(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDistratoDto: UpdateDistratoDto,
  ) {
    return this.documentosService.updateDistrato(id, updateDistratoDto);
  }

  @Delete('distratos/:id')
  removeDistrato(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.removeDistrato(id);
  }

  // QUITAÇÕES
  @Post('quitacoes')
  createQuitacao(@Body() createQuitacaoDto: CreateQuitacaoDto) {
    return this.documentosService.createQuitacao(createQuitacaoDto);
  }

  @Get('quitacoes')
  findAllQuitacoes(@Query('contratoId') contratoId?: string) {
    return this.documentosService.findAllQuitacoes(contratoId ? parseInt(contratoId) : null);
  }

  @Get('quitacoes/:id')
  findOneQuitacao(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.findOneQuitacao(id);
  }

  @Patch('quitacoes/:id')
  updateQuitacao(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuitacaoDto: UpdateQuitacaoDto,
  ) {
    return this.documentosService.updateQuitacao(id, updateQuitacaoDto);
  }

  @Delete('quitacoes/:id')
  removeQuitacao(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.removeQuitacao(id);
  }

  // DOCUMENTOS GERAIS
  @Post()
  createDocumento(@Body() createDocumentoDto: CreateDocumentoDto) {
    return this.documentosService.createDocumento(createDocumentoDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocumento(
    @Body() data: { tipo: string; contratoId: string },
    @UploadedFile() file: any, // Alterado de Express.Multer.File para any
  ) {
    return this.documentosService.uploadDocumento(
      parseInt(data.contratoId),
      data.tipo,
      file,
    );
  }

  @Get()
  findAllDocumentos(@Query('contratoId') contratoId?: string) {
    return this.documentosService.findAllDocumentos(contratoId ? parseInt(contratoId) : null);
  }

  @Get(':id')
  findOneDocumento(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.findOneDocumento(id);
  }

  @Get(':id/download')
  async downloadDocumento(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const documento = await this.documentosService.findOneDocumento(id);
    
    // Em um ambiente real, você enviaria o arquivo para download
    // Aqui apenas simulamos uma resposta
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${documento.nome}`);
    res.send({ message: 'Arquivo simulado' });
  }

  @Patch(':id')
  updateDocumento(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentoDto: UpdateDocumentoDto,
  ) {
    return this.documentosService.updateDocumento(id, updateDocumentoDto);
  }

  @Delete(':id')
  removeDocumento(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.removeDocumento(id);
  }
}