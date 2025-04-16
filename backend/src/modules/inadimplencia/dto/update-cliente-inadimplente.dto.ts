import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteInadimplenteDto } from './cliente-inadimplente.dto';

export class UpdateClienteInadimplenteDto extends PartialType(CreateClienteInadimplenteDto) {}