// backend/src/modules/documentos/documentos.module.ts

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { DocumentosService } from './documentos.service';
import { DocumentosController } from './documentos.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Primeiro, garantir que o diretório base de uploads existe
          const baseDir = join(__dirname, '..', '..', '..', 'uploads');
          if (!existsSync(baseDir)) {
            mkdirSync(baseDir, { recursive: true });
          }
          
          // Depois, garantir que o subdiretório de documentos existe
          const docsDir = join(baseDir, 'documentos');
          if (!existsSync(docsDir)) {
            mkdirSync(docsDir, { recursive: true });
          }
          
          // Usar o diretório temporário como destino inicial
          const tempDir = join(docsDir, 'temp');
          if (!existsSync(tempDir)) {
            mkdirSync(tempDir, { recursive: true });
          }
          
          // Usar o diretório criado como destino
          cb(null, tempDir);
        },
        filename: (req, file, cb) => {
          // Criar um nome aleatório para o arquivo
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [DocumentosController],
  providers: [DocumentosService],
  exports: [DocumentosService],
})
export class DocumentosModule {}