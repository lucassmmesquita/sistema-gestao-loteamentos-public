import { IsString, IsNumber, Min } from 'class-validator';

export class ParametrosReajusteDto {
  @IsString()
  indiceBase: string;

  @IsNumber()
  @Min(0)
  percentualAdicional: number;

  @IsNumber()
  @Min(1)
  intervaloParcelas: number;

  @IsNumber()
  @Min(1)
  alertaAntecipadoDias: number;
}