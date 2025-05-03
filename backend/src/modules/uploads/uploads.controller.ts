// backend/src/modules/uploads/uploads.controller.ts

import { Controller, Post, UploadedFile, UseInterceptors, Param, Body, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('contratos')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/contratos',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = file.originalname.split('.').pop();
        cb(null, `contrato-${uniqueSuffix}.${extension}`);
      }
    })
  }))
  async uploadContratoFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
    @Request() req
  ) {
    return this.uploadsService.saveContratoFile(file, body.contratoId, req.user.id);
  }

  @Post('documentos')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/documentos',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = file.originalname.split('.').pop();
        cb(null, `doc-${uniqueSuffix}.${extension}`);
      }
    })
  }))
  async uploadDocumentoFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
    @Request() req
  ) {
    return this.uploadsService.saveDocumentoFile(file, body.contratoId, body.tipo, req.user.id);
  }
}