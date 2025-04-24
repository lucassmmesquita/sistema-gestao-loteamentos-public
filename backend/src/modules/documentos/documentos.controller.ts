// backend/src/modules/documentos/documentos.controller.ts

import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentosService } from './documentos.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post()
  create(@Body() createDocumentoDto: CreateDocumentoDto) {
    return this.documentosService.create(createDocumentoDto);
  }

  @Get()
  findAll(@Query('clienteId') clienteId?: string) {
    return this.documentosService.findAll(clienteId ? parseInt(clienteId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentoDto: UpdateDocumentoDto,
  ) {
    return this.documentosService.update(id, updateDocumentoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.remove(id);
  }

  @Post('upload/:clienteId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('tipoDocumento') tipoDocumento: string,
  ) {
    return this.documentosService.uploadFile(clienteId, file, tipoDocumento);
  }
}