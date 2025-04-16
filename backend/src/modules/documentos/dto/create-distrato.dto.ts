import { IsNumber, IsString, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDistratoDto {
  @IsNumber()
  contratoId: number;

  @IsDate()
  @Type(() => Date)
  dataDistrato: Date;

  @IsString()
  motivoDistrato: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorDevolucao?: number;

  @IsOptional()
  @IsString()
  documentoUrl?: string;
}