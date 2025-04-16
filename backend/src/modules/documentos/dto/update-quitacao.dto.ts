import { PartialType } from '@nestjs/mapped-types';
import { CreateQuitacaoDto } from './create-quitacao.dto';

export class UpdateQuitacaoDto extends PartialType(CreateQuitacaoDto) {}