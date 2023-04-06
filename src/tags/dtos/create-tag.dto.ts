import { IsNotEmpty, IsString } from 'class-validator';

import { Tag } from '../../entities/tag.entity';

export class CreateTagDto {
  static resource = Tag.name;

  @IsString()
  @IsNotEmpty()
  name: string;
}
