import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ImportLoteDto {
  @IsNumber()
  @Type(() => Number)
  quadra: number;

  @IsNumber()
  @Type(() => Number)
  lote: number;

  @IsNumber()
  @Type(() => Number)
  area: number;

  @IsString()
  chave: string;
}