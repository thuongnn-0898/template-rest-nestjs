import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from './base.entity';
import { EntityConstant } from '../shared/constants/entity.constant';
import { User } from './user.entity';

@Entity('posts')
@Index(['title'], { unique: true, where: 'deleted IS NULL' })
export class Post extends Base {
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'uuid',
    name: 'user_id',
    nullable: false,
  })
  userId: string;

  @Column({
    type: 'varchar',
    name: 'title',
    length: EntityConstant.shortLength,
    nullable: false,
    unique: true,
  })
  title: string;

  @Column({
    type: 'varchar',
    name: 'description',
    length: EntityConstant.longLength,
    nullable: true,
  })
  description: string;
}
