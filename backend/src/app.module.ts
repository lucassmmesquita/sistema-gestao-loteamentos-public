// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// Correção do caminho de importação - uso de caminho relativo explícito
import { PrismaModule } from './prisma/prisma.module';  
import { ClientesModule } from './modules/clientes/clientes.module';
import { ContratosModule } from './modules/contratos/contratos.module';
import { BoletosModule } from './modules/boletos/boletos.module';
import { LotesModule } from './modules/lotes/lotes.module';
import { InadimplenciaModule } from './modules/inadimplencia/inadimplencia.module';
import { ReajustesModule } from './modules/reajustes/reajustes.module';
import { DocumentosModule } from './modules/documentos/documentos.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ParcelasModule } from './modules/parcelas/parcelas.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    ClientesModule,
    ContratosModule,
    BoletosModule,
    LotesModule,
    InadimplenciaModule,
    ReajustesModule,
    DocumentosModule,
    DashboardModule,
    AuthModule,
    ParcelasModule
  ],
})
export class AppModule {}