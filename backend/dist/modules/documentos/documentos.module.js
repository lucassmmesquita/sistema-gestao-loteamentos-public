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
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const documentos_service_1 = require("./documentos.service");
const documentos_controller_1 = require("./documentos.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
let DocumentosModule = class DocumentosModule {
};
DocumentosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: (req, file, cb) => {
                        const baseDir = (0, path_1.join)(__dirname, '..', '..', '..', 'uploads');
                        if (!(0, fs_1.existsSync)(baseDir)) {
                            (0, fs_1.mkdirSync)(baseDir, { recursive: true });
                        }
                        const docsDir = (0, path_1.join)(baseDir, 'documentos');
                        if (!(0, fs_1.existsSync)(docsDir)) {
                            (0, fs_1.mkdirSync)(docsDir, { recursive: true });
                        }
                        const tempDir = (0, path_1.join)(docsDir, 'temp');
                        if (!(0, fs_1.existsSync)(tempDir)) {
                            (0, fs_1.mkdirSync)(tempDir, { recursive: true });
                        }
                        cb(null, tempDir);
                    },
                    filename: (req, file, cb) => {
                        const randomName = Array(32)
                            .fill(null)
                            .map(() => Math.round(Math.random() * 16).toString(16))
                            .join('');
                        cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
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