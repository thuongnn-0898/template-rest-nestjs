import { Module, Post } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
