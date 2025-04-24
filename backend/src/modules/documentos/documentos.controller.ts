// backend/src/modules/documentos/documentos.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentosService } from './documentos.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post()
  async create(@Body() createDocumentoDto: any) {
    return this.documentosService.create(createDocumentoDto);
  }

  @Get()
  async findAll(@Query('clienteId') clienteId?: string) {
    return this.documentosService.findAll(clienteId ? parseInt(clienteId) : undefined);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.remove(id);
  }

  @Post('upload/:clienteId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Obtém o clienteId dos parâmetros de rota
          const clienteId = req.params.clienteId;
          // Obtém o tipo de documento do body
          const tipoDocumento = req.body.tipoDocumento;
          
          // Cria o caminho para o diretório de destino
          const uploadPath = path.join(process.cwd(), 'uploads', 'documentos', clienteId, tipoDocumento);
          
          // Cria o diretório se não existir
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          
          // Retorna o caminho
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Gera um nome único para o arquivo
          const uniqueSuffix = uuidv4();
          const fileExt = extname(file.originalname);
          cb(null, `${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Body('tipoDocumento') tipoDocumento: string,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo não fornecido');
    }

    if (!tipoDocumento) {
      throw new BadRequestException('Tipo de documento não fornecido');
    }

    console.log('Upload recebido:', {
      clienteId,
      tipoDocumento,
      file: {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      }
    });

    // Cria o registro no banco de dados
    return this.documentosService.create({
      clienteId,
      tipo: tipoDocumento,
      nome: file.originalname,
      arquivo: file.path.replace(/\\/g, '/').replace(`${process.cwd().replace(/\\/g, '/')}/uploads`, '/uploads'),
    });
  }
}