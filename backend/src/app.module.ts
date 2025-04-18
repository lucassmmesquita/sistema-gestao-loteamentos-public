// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { ContratosModule } from './modules/contratos/contratos.module';
import { BoletosModule } from './modules/boletos/boletos.module';
import { LotesModule } from './modules/lotes/lotes.module';
import { InadimplenciaModule } from './modules/inadimplencia/inadimplencia.module';
import { ReajustesModule } from './modules/reajustes/reajustes.module';
import { DocumentosModule } from './modules/documentos/documentos.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AuthModule } from './modules/auth/auth.module'; // Nova importação

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    AuthModule, // Adicionado o módulo de autenticação
  ],
})
export class AppModule {}