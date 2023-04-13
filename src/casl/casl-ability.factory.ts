import { PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { ActionEnum } from './casl.enum';
import { Permission } from '../entities/permission.entity';
import { PermissionService } from '../permissions/permission.service';

export type PermissionObjectType = any;
export type AppAbility = PureAbility<[ActionEnum, PermissionObjectType]>;

interface CaslPermission {
  action: ActionEnum;
  subject: string;
}

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly permissionService: PermissionService) {}
  async defineAbilityForUser(roleId: string) {
    const permissions: Permission[] =
      await this.permissionService.findAllPermissionsOfUser(roleId);

    const caslPermissions: CaslPermission[] = permissions.map(
      (permission) =>
        ({
          action: permission.action,
          subject: permission.permissionResource.name,
        } as CaslPermission),
    );

    return new PureAbility<[ActionEnum, PermissionObjectType]>(caslPermissions);
  }
}
