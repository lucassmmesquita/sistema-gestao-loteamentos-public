import { Module } from '@nestjs/common';
import { ReajustesService } from './reajustes.service';
import { ReajustesController } from './reajustes.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReajustesController],
  providers: [ReajustesService],
  exports: [ReajustesService],
})
export class ReajustesModule {}