// backend/src/modules/inadimplencia/dto/enviar-comunicacao.dto.ts

import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class EnviarComunicacaoDto {
  @IsNumber()
  clienteId: number;

  @IsString()
  tipo: string;

  @IsString()
  mensagem: string;

  @IsOptional()
  @IsArray()
  anexos?: string[];
}