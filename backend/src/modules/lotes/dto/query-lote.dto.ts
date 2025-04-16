import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryLoteDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  quadra?: string;

  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsString()
  loteamento?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  areaMinima?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  areaMaxima?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  valorMinimo?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  valorMaximo?: number;
}