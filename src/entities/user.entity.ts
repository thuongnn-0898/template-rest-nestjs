import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Base } from './base.entity';
import { Post } from './post.entity';
import { Role } from './role.entity';
import { EntityConstant } from '../shared/constants/entity.constant';

@Entity('users')
@Index(['username'], { unique: true, where: 'deleted IS NULL' })
@Index(['email'], { unique: true, where: 'deleted IS NULL' })
@Index(['code'], { unique: true, where: 'deleted IS NULL' })
export class User extends Base {
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({
    type: 'varchar',
    name: 'username',
    length: EntityConstant.shortLength,
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    name: 'password',
    length: EntityConstant.shortLength,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    name: 'email',
    length: EntityConstant.shortLength,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    name: 'code',
    type: 'varchar',
    nullable: false,
    length: EntityConstant.shortLength,
    unique: true,
  })
  code: string;

  @Column({
    type: 'uuid',
    name: 'role_id',
    nullable: false,
  })
  roleId: string;
}
