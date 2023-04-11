import { Expose, Type } from 'class-transformer';

import { TagDto } from '../../tags/dtos/tag.dto';

export class PostDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  fileName: string;

  @Expose()
  @Type(() => TagDto)
  tags: TagDto[];
}
