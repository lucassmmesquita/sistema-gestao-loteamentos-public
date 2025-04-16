"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReajusteDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_reajuste_dto_1 = require("./create-reajuste.dto");
class UpdateReajusteDto extends (0, mapped_types_1.PartialType)(create_reajuste_dto_1.CreateReajusteDto) {
}
exports.UpdateReajusteDto = UpdateReajusteDto;
//# sourceMappingURL=update-reajuste.dto.js.map