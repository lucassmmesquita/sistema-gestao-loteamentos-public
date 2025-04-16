import { PartialType } from '@nestjs/mapped-types';
import { CreateAditivoDto } from './create-aditivo.dto';

export class UpdateAditivoDto extends PartialType(CreateAditivoDto) {}