import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { EntityConstant } from '../../shared/constants/entity.constant';
import { Post } from '../../entities/post.entity';

export class Test2 {
  static resource = Post.name;
  @IsNotEmpty()
  @MaxLength(EntityConstant.shortLength)
  title: string;

  @IsOptional()
  @MaxLength(EntityConstant.longLength)
  description: string;
}
