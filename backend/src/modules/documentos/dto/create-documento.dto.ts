// backend/src/modules/documentos/dto/create-documento.dto.ts

import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDocumentoDto {
  @IsNumber()
  clienteId: number;

  @IsString()
  tipo: string;

  @IsString()
  nome: string;

  @IsString()
  arquivo: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataUpload?: Date;

  @IsOptional()
  @IsString()
  s3Key?: string;
}