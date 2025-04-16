import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryContratoDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  clienteId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  loteId?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @IsOptional()
  @IsDateString()
  dataFim?: string;
}