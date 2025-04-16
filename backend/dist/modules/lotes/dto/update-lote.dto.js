"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLoteDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_lote_dto_1 = require("./create-lote.dto");
class UpdateLoteDto extends (0, mapped_types_1.PartialType)(create_lote_dto_1.CreateLoteDto) {
}
exports.UpdateLoteDto = UpdateLoteDto;
//# sourceMappingURL=update-lote.dto.js.map