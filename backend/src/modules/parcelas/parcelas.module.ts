// backend/src/modules/parcelas/parcelas.module.ts
import { Module } from '@nestjs/common';
import { ParcelasService } from './parcelas.service';
import { ParcelasController } from './parcelas.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParcelasController],
  providers: [ParcelasService],
  exports: [ParcelasService],
})
export class ParcelasModule {}