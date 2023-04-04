import { Injectable } from '@nestjs/common';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { Post } from '../entities/post.entity';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    return this.postRepository.save({
      ...createPostDto,
      userId,
    });
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return { name: undefined };
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    if (isNaN(id)) {
      throw new EntityNotFoundError(Post.name, undefined);
    }

    return `This action removes a #${id} post`;
  }
}
