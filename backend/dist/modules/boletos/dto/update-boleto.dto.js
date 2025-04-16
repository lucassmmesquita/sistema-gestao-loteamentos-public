"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBoletoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_boleto_dto_1 = require("./create-boleto.dto");
class UpdateBoletoDto extends (0, mapped_types_1.PartialType)(create_boleto_dto_1.CreateBoletoDto) {
}
exports.UpdateBoletoDto = UpdateBoletoDto;
//# sourceMappingURL=update-boleto.dto.js.map