import { IsNotEmpty, MaxLength } from 'class-validator';

import { EntityConstant } from 'src/shared/constants/entity.constant';

export class TestDto {
  @IsNotEmpty()
  @MaxLength(EntityConstant.shortLength)
  title: string;

  @IsNotEmpty()
  @MaxLength(EntityConstant.longLength)
  description: string;
}
