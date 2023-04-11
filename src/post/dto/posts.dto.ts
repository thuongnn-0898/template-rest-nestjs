import { Expose, Type } from 'class-transformer';

import { Post } from '../../entities/post.entity';
import { Default } from '../../shared/decorators/default.decorator';

export class PostsDto {
  @Type(() => Post)
  @Expose()
  @Default([])
  posts: Post[];
}
