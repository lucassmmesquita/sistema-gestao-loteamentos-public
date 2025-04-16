import { PartialType } from '@nestjs/mapped-types';
import { CreateReajusteDto } from './create-reajuste.dto';

export class UpdateReajusteDto extends PartialType(CreateReajusteDto) {}