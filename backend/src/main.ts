// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
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