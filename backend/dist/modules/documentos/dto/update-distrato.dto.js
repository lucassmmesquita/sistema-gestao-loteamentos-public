"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDistratoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_distrato_dto_1 = require("./create-distrato.dto");
class UpdateDistratoDto extends (0, mapped_types_1.PartialType)(create_distrato_dto_1.CreateDistratoDto) {
}
exports.UpdateDistratoDto = UpdateDistratoDto;
//# sourceMappingURL=update-distrato.dto.js.map