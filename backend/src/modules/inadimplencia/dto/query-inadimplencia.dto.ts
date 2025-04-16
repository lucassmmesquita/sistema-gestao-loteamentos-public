import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryInadimplenciaDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  clienteId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  contratoId?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  diasAtrasoMin?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  diasAtrasoMax?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  valorMinimo?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  valorMaximo?: number;

  @IsOptional()
  @IsDateString()
  dataUltimaCobrancaInicio?: string;

  @IsOptional()
  @IsDateString()
  dataUltimaCobrancaFim?: string;
}