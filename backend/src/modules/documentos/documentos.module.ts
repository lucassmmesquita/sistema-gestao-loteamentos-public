// backend/src/modules/documentos/documentos.module.ts

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DocumentosController } from './documentos.controller';
import { DocumentosService } from './documentos.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Obter o clienteId dos parâmetros de rota
          const clienteId = req.params.clienteId;
          // Obter o tipo de documento do body
          const tipoDocumento = req.body.tipoDocumento;
          
          // Criar o caminho para o diretório de destino
          const uploadPath = path.join(process.cwd(), 'uploads', 'documentos', clienteId, tipoDocumento);
          
          // Criar o diretório se não existir
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          
          // Retornar o caminho
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Gerar um nome único para o arquivo
          const uniqueSuffix = uuidv4();
          const fileExt = extname(file.originalname);
          cb(null, `${uniqueSuffix}${fileExt}`);
        },
      }),
    }),
  ],
  controllers: [DocumentosController],
  providers: [DocumentosService],
  exports: [DocumentosService],
})
export class DocumentosModule {}