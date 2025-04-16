import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryReajusteDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  contratoId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cliente?: number;

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