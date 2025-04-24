// backend/src/modules/inadimplencia/dto/gerar-boleto.dto.ts

import { IsOptional, IsString, IsNumber } from 'class-validator';

export class GerarBoletoDto {
  @IsOptional()
  @IsNumber()
  valorAdicional?: number;

  @IsOptional()
  @IsString()
  observacao?: string;
}