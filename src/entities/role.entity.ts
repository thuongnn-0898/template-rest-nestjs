import { Column, Entity, Index, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { User } from './user.entity';
import { RolePermission } from './role-permission.entity';
import { EntityConstant } from '../shared/constants/entity.constant';

@Entity('roles')
@Index(['name'], { unique: true, where: 'deleted IS NULL' })
export class Role extends Base {
  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];

  @Column({
    type: 'varchar',
    name: 'name',
    length: EntityConstant.shortLength,
    nullable: false,
    unique: true,
  })
  name: string;
}
