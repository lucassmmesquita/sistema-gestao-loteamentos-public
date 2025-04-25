import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class ImportContratoDto {
  @IsString()
  chave: string;

  @IsString()
  numeroContrato: string;

  @IsDateString()
  dataEmissao: string;

  @IsNumber()
  @Type(() => Number)
  valorContrato: number;

  @IsNumber()
  @Type(() => Number)
  numeroParcelas: number;

  @IsDateString()
  dataPrimeiraPrestacao: string;

  @IsNumber()
  @Type(() => Number)
  valorPrestacao: number;

  @IsNumber()
  @Type(() => Number)
  idCliente: number;

  @IsNumber()
  @Type(() => Number)
  numeroLote: number;

  @IsNumber()
  @Type(() => Number)
  quadraLote: number;

  @IsNumber()
  @Type(() => Number)
  areaLote: number;
}