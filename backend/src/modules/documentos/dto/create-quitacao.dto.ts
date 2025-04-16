import { IsNumber, IsString, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuitacaoDto {
  @IsNumber()
  contratoId: number;

  @IsDate()
  @Type(() => Date)
  dataQuitacao: Date;

  @IsNumber()
  @Min(0)
  valorQuitacao: number;

  @IsOptional()
  @IsString()
  documentoUrl?: string;
}