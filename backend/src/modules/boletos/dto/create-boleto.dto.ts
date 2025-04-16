import { IsNumber, IsString, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBoletoDto {
  @IsNumber()
  clienteId: number;

  @IsString()
  clienteNome: string;

  @IsNumber()
  contratoId: number;

  @IsNumber()
  @Min(0)
  valor: number;

  @IsDate()
  @Type(() => Date)
  dataVencimento: Date;

  @IsNumber()
  @Min(1)
  numeroParcela: number;

  @IsString()
  descricao: string;
  
  @IsOptional()
  @IsString()
  nossoNumero?: string;
  
  @IsOptional()
  @IsString()
  linhaDigitavel?: string;
  
  @IsOptional()
  @IsString()
  codigoBarras?: string;
  
  @IsOptional()
  @IsString()
  pdfUrl?: string;
}