import { IsNumber, IsString, IsDateString, IsBoolean, Min } from 'class-validator';

export class CreateReajusteDto {
  @IsNumber()
  contratoId: number;

  @IsNumber()
  @Min(1)
  parcelaReferencia: number;

  @IsNumber()
  @Min(0)
  valorOriginal: number;

  @IsNumber()
  @Min(0)
  valorReajustado: number;

  @IsNumber()
  @Min(0)
  indiceAplicado: number;

  @IsString()
  indiceBase: string;

  @IsNumber()
  @Min(0)
  percentualAdicional: number;

  @IsNumber()
  @Min(0)
  reajusteTotal: number;

  @IsDateString()
  dataReferencia: string;

  @IsDateString()
  dataAplicacao?: string;

  @IsString()
  status: string = 'pendente';

  @IsBoolean()
  aplicado: boolean = false;
}