import { IsNumber, IsString, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PagamentoParcelaDto {
  @IsDate()
  @Type(() => Date)
  dataPagamento: Date;

  @IsNumber()
  @Min(0)
  valorPago: number;

  @IsString()
  formaPagamento: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}