"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_documento_dto_1 = require("./create-documento.dto");
class UpdateDocumentoDto extends (0, mapped_types_1.PartialType)(create_documento_dto_1.CreateDocumentoDto) {
}
exports.UpdateDocumentoDto = UpdateDocumentoDto;
//# sourceMappingURL=update-documento.dto.js.map