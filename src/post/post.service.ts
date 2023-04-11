import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { Post } from '../entities/post.entity';
import { generateToken, getFileType } from '../shared/utils/app.util';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(
    createPostDto: CreatePostDto,
    userId: string,
    file: Buffer,
    mimeType: string,
  ): Promise<Post> {
    if (file) {
      Object.assign(createPostDto, {
        fileName: `${generateToken()}.${getFileType(mimeType)}`,
      });

      fs.writeFileSync(`uploads/${createPostDto.fileName}`, file, 'binary');
    }

    const post = await this.postRepository.savePost(userId, createPostDto);

    if (!post || !fs.existsSync(`uploads/${createPostDto.fileName}`)) {
      await this.postRepository.delete(post);

      fs.unlinkSync(`uploads/${createPostDto.fileName}`);
    }

    return post;
  }

  async findAll(userId: string): Promise<Post[]> {
    return await this.postRepository.findManyByUserId(userId);
  }

  async findOneOrFail(userId: string, id: string): Promise<Post> {
    const post = await this.postRepository.findPostById(userId, id);

    if (!post) {
      throw new EntityNotFoundError(Post.name, undefined);
    }

    return post;
  }

  async update(
    userId: string,
    id: string,
    updatePostDto: UpdatePostDto,
    file: Buffer,
    mimeType: string,
  ): Promise<Post> {
    const post = await this.findOneOrFail(userId, id);

    if (file) {
      Object.assign(updatePostDto, {
        fileName: `${generateToken()}.${getFileType(mimeType)}`,
      });

      try {
        fs.writeFileSync(`uploads/${updatePostDto.fileName}`, file, 'binary');
        fs.unlinkSync(post.fileName);
      } catch (error) {
        if (fs.existsSync(`uploads/${updatePostDto.fileName}`)) {
          fs.unlinkSync(`uploads/${updatePostDto.fileName}`);
        }

        throw error;
      }
    }

    return this.postRepository.savePost(userId, {
      id,
      ...updatePostDto,
    });
  }

  async remove(userId: string, id: string): Promise<boolean> {
    const post = await this.findOneOrFail(userId, id);

    await this.postRepository.softDelete(id);

    if (post.fileName) {
      fs.unlinkSync(post.fileName);
    }

    return true;
  }
}
