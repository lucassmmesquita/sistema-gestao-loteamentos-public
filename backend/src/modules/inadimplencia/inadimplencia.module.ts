// backend/src/modules/inadimplencia/inadimplencia.module.ts

import { Module } from '@nestjs/common';
import { InadimplenciaController } from './inadimplencia.controller';
import { InadimplenciaService } from './inadimplencia.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InadimplenciaController],
  providers: [InadimplenciaService],
  exports: [InadimplenciaService],
})
export class InadimplenciaModule {}