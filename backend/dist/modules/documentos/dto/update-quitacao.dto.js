"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateQuitacaoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_quitacao_dto_1 = require("./create-quitacao.dto");
class UpdateQuitacaoDto extends (0, mapped_types_1.PartialType)(create_quitacao_dto_1.CreateQuitacaoDto) {
}
exports.UpdateQuitacaoDto = UpdateQuitacaoDto;
//# sourceMappingURL=update-quitacao.dto.js.map