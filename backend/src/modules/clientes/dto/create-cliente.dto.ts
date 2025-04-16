import { IsString, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EnderecoDto {
  @IsString()
  cep: string;

  @IsString()
  logradouro: string;

  @IsString()
  numero: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  @IsString()
  bairro: string;

  @IsString()
  cidade: string;

  @IsString()
  estado: string;
}

export class ContatoDto {
  @IsString({ each: true })
  telefones: string[];

  @IsString({ each: true })
  emails: string[];
}

export class CreateClienteDto {
  @IsString()
  nome: string;

  @IsString()
  cpfCnpj: string;

  @IsOptional()
  @IsDateString()
  dataNascimento?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco?: EnderecoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContatoDto)
  contatos?: ContatoDto;
}