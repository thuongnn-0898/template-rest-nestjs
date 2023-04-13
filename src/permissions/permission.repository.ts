import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionRepository extends Repository<Permission> {
  constructor(private readonly dataSource: DataSource) {
    super(Permission, dataSource.manager);
  }

  async findAllPermissions(roleId: string): Promise<Permission[]> {
    return await this.createQueryBuilder('permission')
      .leftJoin('permission.rolePermissions', 'rolePermissions')
      .leftJoin('rolePermissions.role', 'role')
      .leftJoinAndSelect('permission.permissionResource', 'permissionResource')
      .where('role.id = :id', { id: roleId })
      .getMany();
  }
}
