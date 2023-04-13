import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from './base.entity';
import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Entity('role_permissions')
export class RolePermission extends Base {
  @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  @ManyToOne(() => Role, (role) => role.rolePermissions)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({
    type: 'uuid',
    name: 'permission_id',
    nullable: false,
  })
  permissionId: string;

  @Column({
    type: 'uuid',
    name: 'role_id',
    nullable: false,
  })
  roleId: string;
}
