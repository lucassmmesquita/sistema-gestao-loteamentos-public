import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do CORS
  app.enableCors();
  
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
  SwaggerModule.setup('api', app, document);
  
  // Definindo o prefixo global para a API
  app.setGlobalPrefix('api');
  
  // Iniciando o servidor
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Aplicação iniciada na porta ${port}`);
}
bootstrap();