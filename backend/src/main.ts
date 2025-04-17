import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Criar pasta de uploads se não existir
  const uploadsDir = join(__dirname, '..', 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir);
  }
  
  const documentosDir = join(uploadsDir, 'documentos');
  if (!existsSync(documentosDir)) {
    mkdirSync(documentosDir);
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Adicionando opções para melhorar o log e detecção de erros
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    abortOnError: false
  });
  
  // Configuração do CORS
  app.enableCors({
    origin: true, // Ou especifique os domínios permitidos: ['http://localhost:3000']
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  
  // Configuração de validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Configurar pasta estática para acesso aos documentos
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Gestão de Loteamentos')
    .setDescription('API para o Sistema de Gestão de Loteamentos')
    .setVersion('1.0')
    .addTag('clientes')
    .addTag('contratos')
    .addTag('boletos')
    .addTag('lotes')
    .addTag('inadimplencia')
    .addTag('reajustes')
    .addTag('documentos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Definindo o prefixo global para a API
  app.setGlobalPrefix('api');
  
  // Adicionando handler para erros não tratados
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });
  
  // Iniciando o servidor
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Aplicação iniciada na porta ${port}`);
  console.log(`Documentação da API disponível em: http://localhost:${port}/api/docs`);
}
bootstrap();