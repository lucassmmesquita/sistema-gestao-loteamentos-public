import { Module } from '@nestjs/common';
import { InadimplenciaService } from './inadimplencia.service';
import { InadimplenciaController } from './inadimplencia.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InadimplenciaController],
  providers: [InadimplenciaService],
  exports: [InadimplenciaService],
})
export class InadimplenciaModule {}