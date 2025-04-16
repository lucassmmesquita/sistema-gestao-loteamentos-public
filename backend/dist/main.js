"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
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
    swagger_1.SwaggerModule.setup('api', app, document);
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Aplicação iniciada na porta ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map