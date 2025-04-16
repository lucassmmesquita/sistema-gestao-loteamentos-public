import { IsNumber, IsString, IsDate, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ParcelaInadimplenteDto {
  @IsNumber()
  numero: number;

  @IsDate()
  @Type(() => Date)
  dataVencimento: Date;

  @IsNumber()
  @Min(0)
  valor: number;

  @IsNumber()
  @Min(0)
  valorAtualizado: number;

  @IsString()
  status: string;
}

export class CreateClienteInadimplenteDto {
  @IsNumber()
  clienteId: number;

  @IsNumber()
  contratoId: number;

  @IsNumber()
  @Min(0)
  valorEmAberto: number;

  @IsNumber()
  @Min(0)
  diasAtraso: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ultimaCobranca?: Date;

  @IsString()
  status: string;

  @ValidateNested({ each: true })
  @Type(() => ParcelaInadimplenteDto)
  parcelas: ParcelaInadimplenteDto[];
}