import { IsNumber, IsString, IsDateString, IsOptional, IsObject } from 'class-validator';

export class CreateComunicacaoDto {
  @IsNumber()
  clienteId: number;

  @IsString()
  tipo: string;

  @IsDateString()
  data: string;

  @IsString()
  mensagem: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsObject()
  parcelaInfo?: Record<string, any>;

  @IsOptional()
  @IsObject()
  anexos?: Record<string, any>;
}