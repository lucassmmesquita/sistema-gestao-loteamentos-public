// backend/src/modules/inadimplencia/dto/salvar-gatilhos.dto.ts

import { IsArray } from 'class-validator';

export class SalvarGatilhosDto {
  @IsArray()
  gatilhos: any[];
}