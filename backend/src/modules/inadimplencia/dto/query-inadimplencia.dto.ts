// backend/src/modules/inadimplencia/dto/query-inadimplencia.dto.ts

import { IsOptional, IsString } from 'class-validator';

export class QueryInadimplenciaDto {
  @IsOptional()
  @IsString()
  statusPagamento?: string;

  @IsOptional()
  @IsString()
  contratoId?: string;

  @IsOptional()
  @IsString()
  valorMinimo?: string;

  @IsOptional()
  @IsString()
  valorMaximo?: string;

  @IsOptional()
  @IsString()
  diasAtrasoMin?: string;

  @IsOptional()
  @IsString()
  diasAtrasoMax?: string;

  @IsOptional()
  @IsString()
  dataUltimaCobrancaInicio?: string;

  @IsOptional()
  @IsString()
  dataUltimaCobrancaFim?: string;
}