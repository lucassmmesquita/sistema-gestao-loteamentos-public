"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClienteDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_cliente_dto_1 = require("./create-cliente.dto");
class UpdateClienteDto extends (0, mapped_types_1.PartialType)(create_cliente_dto_1.CreateClienteDto) {
}
exports.UpdateClienteDto = UpdateClienteDto;
//# sourceMappingURL=update-cliente.dto.js.map