import { Module } from '@nestjs/common';

import { CaslAbilityFactory } from './casl-ability.factory';
import { PermissionModule } from '../permissions/permission.module';
import { PermissionRepository } from '../permissions/permission.repository';
import { PermissionService } from '../permissions/permission.service';

@Module({
  imports: [PermissionModule],
  providers: [CaslAbilityFactory, PermissionService, PermissionRepository],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
