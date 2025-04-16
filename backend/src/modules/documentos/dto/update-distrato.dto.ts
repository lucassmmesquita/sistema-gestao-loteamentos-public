import { PartialType } from '@nestjs/mapped-types';
import { CreateDistratoDto } from './create-distrato.dto';

export class UpdateDistratoDto extends PartialType(CreateDistratoDto) {}