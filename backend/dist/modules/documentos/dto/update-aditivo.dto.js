"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAditivoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_aditivo_dto_1 = require("./create-aditivo.dto");
class UpdateAditivoDto extends (0, mapped_types_1.PartialType)(create_aditivo_dto_1.CreateAditivoDto) {
}
exports.UpdateAditivoDto = UpdateAditivoDto;
//# sourceMappingURL=update-aditivo.dto.js.map