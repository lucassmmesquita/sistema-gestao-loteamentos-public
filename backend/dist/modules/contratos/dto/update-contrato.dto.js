"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateContratoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_contrato_dto_1 = require("./create-contrato.dto");
class UpdateContratoDto extends (0, mapped_types_1.PartialType)(create_contrato_dto_1.CreateContratoDto) {
}
exports.UpdateContratoDto = UpdateContratoDto;
//# sourceMappingURL=update-contrato.dto.js.map