import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateLoteDto {
  @IsString()
  numero: string;

  @IsString()
  quadra: string;

  @IsString()
  loteamento: string;

  @IsNumber()
  @Min(0)
  area: number;

  @IsNumber()
  @Min(0)
  valorBase: number;

  @IsOptional()
  @IsString()
  status: string = 'disponivel';
}