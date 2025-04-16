import { IsNumber, IsDateString, IsString, Min } from 'class-validator';

export class CreateContratoDto {
  @IsNumber()
  clienteId: number;

  @IsNumber()
  loteId: number;

  @IsDateString()
  dataInicio: string;

  @IsDateString()
  dataFim: string;

  @IsNumber()
  @Min(0)
  valorTotal: number;

  @IsNumber()
  @Min(0)
  valorEntrada: number;

  @IsNumber()
  @Min(1)
  numeroParcelas: number;

  @IsNumber()
  @Min(1)
  @Min(31)
  dataVencimento: number;

  @IsString()
  clausulas: string;

  @IsString()
  status: string = 'ativo';
}