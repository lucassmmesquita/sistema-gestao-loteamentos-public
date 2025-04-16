import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateDocumentoDto {
  @IsNumber()
  contratoId: number;

  @IsString()
  tipo: string;

  @IsString()
  nome: string;

  @IsString()
  arquivo: string;

  @IsOptional()
  @IsString()
  descricao?: string;
}