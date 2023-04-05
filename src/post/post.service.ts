import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { Post } from '../entities/post.entity';
import { ErrorUtil } from '../shared/utils/error.util';
import { ErrorConstant } from '../errors/error.constant';

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
    throw new BadRequestException(
      ErrorUtil.badRequest(
        ErrorConstant.type.somethingError,
        'error property',
        Post.name,
      ),
    );
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
