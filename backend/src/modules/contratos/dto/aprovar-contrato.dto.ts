// backend/src/modules/contratos/dto/aprovar-contrato.dto.ts

import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export enum NivelAprovacao {
  VENDEDOR = 'vendedor',
  DIRETOR = 'diretor',
  PROPRIETARIO = 'proprietario'
}

export class AprovarContratoDto {
  @IsEnum(NivelAprovacao)
  nivel: NivelAprovacao;
  
  @IsBoolean()
  aprovado: boolean;
  
  @IsOptional()
  @IsString()
  observacao?: string;
}