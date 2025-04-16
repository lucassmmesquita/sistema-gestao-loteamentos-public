import { Module } from '@nestjs/common';
import { LotesService } from './lotes.service';
import { LotesController } from './lotes.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LotesController],
  providers: [LotesService],
  exports: [LotesService],
})
export class LotesModule {}