import { IsString, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer'; // Adicionando importação para Transform

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
  @IsDateString() // Usando IsDateString em vez de IsDate, pois valida strings no formato de data
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