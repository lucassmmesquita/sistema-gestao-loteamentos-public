// backend/src/modules/contratos/dto/oficializar-contrato.dto.ts

import { IsString, IsOptional } from 'class-validator';

export class OficializarContratoDto {
  @IsString()
  contratoOficialUrl: string;
  
  @IsOptional()
  @IsString()
  observacao?: string;
}