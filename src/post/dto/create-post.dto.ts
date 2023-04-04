import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { EntityConstant } from '../../shared/constants/entity.constant';
import { Post } from '../../entities/post.entity';
import { TestDto } from './test.dto';
import { Type } from 'class-transformer';

export class CreatePostDto {
  static resource = Post.name;

  @IsNotEmpty()
  @MaxLength(EntityConstant.shortLength)
  title: string;

  @IsOptional()
  @MaxLength(EntityConstant.longLength)
  description: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TestDto)
  test: TestDto[];

  userId: string;
}
