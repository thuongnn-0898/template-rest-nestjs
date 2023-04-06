import { Injectable } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../entities/post.entity';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(private readonly dataSource: DataSource) {
    super(Post, dataSource.manager);
  }

  async savePost(
    userId: string,
    createPostDto: CreatePostDto | UpdatePostDto,
  ): Promise<Post> {
    let post: Post;

    await this.dataSource.transaction(async (manager: EntityManager) => {
      post = await manager.save(Post, { userId, ...createPostDto });

      let tags = createPostDto.tags.map((tag) => ({ postId: post.id, ...tag }));
      tags = await manager.save(Tag, tags);

      Object.assign(post, { tags });
    });

    return post;
  }

  async findManyByUserId(userId: string): Promise<Post[]> {
    return await this.createQueryBuilder('Post')
      .where('Post.user_id = :userId', {
        userId,
      })
      .leftJoinAndSelect('Post.tags', 'tags', 'tags.deleted IS NULL')
      .getMany();
  }

  async findPostById(userId: string, id: string): Promise<Post> {
    return await this.createQueryBuilder('Post')
      .where('Post.user_id = :userId', {
        userId,
      })
      .andWhere('Post.id = :id', { id })
      .leftJoinAndSelect('Post.tags', 'tags', 'tags.deleted IS NULL')
      .getOne();
  }
}
