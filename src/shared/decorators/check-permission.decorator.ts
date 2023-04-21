import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { PermissionObjectType } from '../../casl/casl-ability.factory';
import { ActionEnum } from '../../casl/casl.enum';

export type RequiredPermission = [ActionEnum, PermissionObjectType];

export const CHECK_PERMISSION_KEY = 'check_permission';
export const CheckPermissions = (
  ...params: RequiredPermission[]
): CustomDecorator<string> => SetMetadata(CHECK_PERMISSION_KEY, params);
