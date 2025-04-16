import { PartialType } from '@nestjs/mapped-types';
import { CreateBoletoDto } from './create-boleto.dto';

export class UpdateBoletoDto extends PartialType(CreateBoletoDto) {}