import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { EntityConstant } from '../../shared/constants/entity.constant';
import { Post } from '../../entities/post.entity';
import { CreateTagDto } from '../../tags/dtos/create-tag.dto';

export class CreatePostDto {
  static resource = Post.name;

  @IsNotEmpty()
  @IsString()
  @MaxLength(EntityConstant.shortLength)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(EntityConstant.longLength)
  description: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  tags: CreateTagDto[];

  fileName: string;
}
