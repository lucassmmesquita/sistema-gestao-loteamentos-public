"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateParcelaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_parcela_dto_1 = require("./create-parcela.dto");
class UpdateParcelaDto extends (0, mapped_types_1.PartialType)(create_parcela_dto_1.CreateParcelaDto) {
}
exports.UpdateParcelaDto = UpdateParcelaDto;
//# sourceMappingURL=update-parcela.dto.js.map