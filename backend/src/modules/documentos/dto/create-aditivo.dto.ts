import { IsNumber, IsString, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAditivoDto {
  @IsNumber()
  contratoId: number;

  @IsString()
  tipo: string;

  @IsDate()
  @Type(() => Date)
  dataAssinatura: Date;

  @IsString()
  motivoAditivo: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  novoValor?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  novaDataFim?: Date;

  @IsOptional()
  @IsString()
  documentoUrl?: string;

  @IsOptional()
  @IsString()
  status?: string = 'ativo';
}