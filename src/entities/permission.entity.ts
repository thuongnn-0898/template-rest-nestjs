import {
  Entity,
  Index,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Base } from './base.entity';
import { PermissionResource } from './permission-resource.entity';
import { RolePermission } from './role-permission.entity';
import { EntityConstant } from '../shared/constants/entity.constant';

@Entity('permissions')
@Index(['action'], { unique: true, where: 'deleted IS NULL' })
export class Permission extends Base {
  @ManyToOne(
    () => PermissionResource,
    (permissionResource) => permissionResource.permissions,
  )
  @JoinColumn({ name: 'permission_resource_id' })
  permissionResource: PermissionResource;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermission[];

  @Column({
    type: 'varchar',
    name: 'action',
    length: EntityConstant.shortLength,
    nullable: false,
    unique: true,
  })
  action: string;

  @Column({
    type: 'uuid',
    name: 'permission_resource_id',
    nullable: false,
  })
  permissionResourceId: string;
}
