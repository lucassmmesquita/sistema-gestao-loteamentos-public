import { IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateInteracaoDto {
  @IsNumber()
  clienteId: number;

  @IsString()
  tipo: string;

  @IsDateString()
  data: string;

  @IsString()
  observacao: string;

  @IsString()
  usuario: string;

  @IsString()
  parcelaId?: string;
}