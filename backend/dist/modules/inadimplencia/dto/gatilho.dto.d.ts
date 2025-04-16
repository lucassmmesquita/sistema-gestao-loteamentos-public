export declare class GatilhoDto {
    dias: number;
    tipo: string;
    ativo: boolean;
    mensagem: string;
}
export declare class ConfiguracaoGatilhosDto {
    executarAutomaticamente: boolean;
    horarioExecucao: string;
    diasExecucao: string[];
    repetirCobrancas: boolean;
    intervaloRepeticao: number;
    limitarRepeticoes: boolean;
    limiteRepeticoes: number;
    gerarLog: boolean;
    gatilhos: GatilhoDto[];
}
