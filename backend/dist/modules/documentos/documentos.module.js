"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentosModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const documentos_controller_1 = require("./documentos.controller");
const documentos_service_1 = require("./documentos.service");
const prisma_module_1 = require("../../prisma/prisma.module");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const fs = require("fs");
const path = require("path");
let DocumentosModule = class DocumentosModule {
};
DocumentosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: (req, file, cb) => {
                        const clienteId = req.params.clienteId;
                        const tipoDocumento = req.body.tipoDocumento;
                        const uploadPath = path.join(process.cwd(), 'uploads', 'documentos', clienteId, tipoDocumento);
                        if (!fs.existsSync(uploadPath)) {
                            fs.mkdirSync(uploadPath, { recursive: true });
                        }
                        cb(null, uploadPath);
                    },
                    filename: (req, file, cb) => {
                        const uniqueSuffix = (0, uuid_1.v4)();
                        const fileExt = (0, path_1.extname)(file.originalname);
                        cb(null, `${uniqueSuffix}${fileExt}`);
                    },
                }),
            }),
        ],
        controllers: [documentos_controller_1.DocumentosController],
        providers: [documentos_service_1.DocumentosService],
        exports: [documentos_service_1.DocumentosService],
    })
], DocumentosModule);
exports.DocumentosModule = DocumentosModule;
//# sourceMappingURL=documentos.module.js.map