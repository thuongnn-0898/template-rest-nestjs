import { Column, Entity, Index, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { Permission } from './permission.entity';
import { EntityConstant } from '../shared/constants/entity.constant';

@Entity('permission_resources')
@Index(['name'], { unique: true, where: 'deleted IS NULL' })
export class PermissionResource extends Base {
  @OneToMany(() => Permission, (permission) => permission.permissionResource)
  permissions: Permission[];

  @Column({
    type: 'varchar',
    name: 'name',
    length: EntityConstant.shortLength,
    nullable: false,
    unique: true,
  })
  name: string;
}
