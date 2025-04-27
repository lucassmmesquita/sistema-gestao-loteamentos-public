import { IsNumber, IsString, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateParcelaDto {
  @IsNumber()
  contratoId: number;

  @IsNumber()
  @Min(1)
  numero: number;

  @IsNumber()
  @Min(0)
  valor: number;

  @IsDate()
  @Type(() => Date)
  dataVencimento: Date;

  @IsOptional()
  @IsString()
  status?: string;
}