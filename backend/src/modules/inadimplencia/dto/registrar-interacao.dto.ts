// backend/src/modules/inadimplencia/dto/registrar-interacao.dto.ts

import { IsString, IsOptional } from 'class-validator';

export class RegistrarInteracaoDto {
  @IsString()
  tipo: string;

  @IsString()
  observacao: string;

  @IsString()
  usuario: string;

  @IsOptional()
  @IsString()
  parcelaId?: string;
}