import { IsNotEmpty, ValidateNested } from 'class-validator';

import { Test2 } from './test2';
import { Type } from 'class-transformer';
import { Test } from '@nestjs/testing';

export class TestDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Test)
  test: Test2[];
}
