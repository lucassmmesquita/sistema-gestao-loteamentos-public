"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
        abortOnError: false
    });
    app.enableCors({
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    app.setGlobalPrefix('api');
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
    });
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Aplicação iniciada na porta ${port}`);
    console.log(`Documentação da API disponível em: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map