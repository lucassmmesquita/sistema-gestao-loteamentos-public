import { IsNumber, IsDateString, Min } from 'class-validator';

export class IndicesEconomicosDto {
  @IsNumber()
  @Min(0)
  IGPM: number;

  @IsNumber()
  @Min(0)
  IPCA: number;

  @IsNumber()
  @Min(0)
  INPC: number;

  @IsDateString()
  data: string;
}