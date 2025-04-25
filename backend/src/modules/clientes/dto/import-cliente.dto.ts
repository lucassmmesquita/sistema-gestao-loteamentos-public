import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class ImportClienteDto {
  @IsNumber()
  @Type(() => Number)
  idCliente: number;

  @IsString()
  nomeComprador: string;

  @IsString()
  @IsOptional()
  nomeConjuge?: string;

  @IsString()
  @IsOptional()
  profissao?: string;

  @IsDateString()
  @IsOptional()
  dataNascimento?: string;

  @IsNumber()
  @Type(() => Number)
  numeroLote: number;

  @IsNumber()
  @Type(() => Number)
  quadraLote: number;

  @IsNumber()
  @Type(() => Number)
  areaLote: number;

  @IsString()
  @IsOptional()
  bairro?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  cep?: string;

  @IsString()
  @IsOptional()
  enderecoCliente?: string;
}