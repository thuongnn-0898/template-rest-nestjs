import { Injectable } from '@nestjs/common';

import { PermissionRepository } from './permission.repository';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepo: PermissionRepository) {}

  async findAllPermissionsOfUser(roleId: string): Promise<Permission[]> {
    return this.permissionRepo.findAllPermissions(roleId);
  }
}
