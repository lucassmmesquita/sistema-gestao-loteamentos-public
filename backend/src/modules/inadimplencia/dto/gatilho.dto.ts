import { IsNumber, IsString, IsBoolean, Min } from 'class-validator';

export class GatilhoDto {
  @IsNumber()
  @Min(1)
  dias: number;

  @IsString()
  tipo: string;

  @IsBoolean()
  ativo: boolean;

  @IsString()
  mensagem: string;
}

export class ConfiguracaoGatilhosDto {
  @IsBoolean()
  executarAutomaticamente: boolean;

  @IsString()
  horarioExecucao: string;

  @IsString({ each: true })
  diasExecucao: string[];

  @IsBoolean()
  repetirCobrancas: boolean;

  @IsNumber()
  @Min(1)
  intervaloRepeticao: number;

  @IsBoolean()
  limitarRepeticoes: boolean;

  @IsNumber()
  @Min(1)
  limiteRepeticoes: number;

  @IsBoolean()
  gerarLog: boolean;

  gatilhos: GatilhoDto[];
}