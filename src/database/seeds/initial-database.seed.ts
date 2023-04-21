import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { PermissionResource } from '../../entities/permission-resource.entity';
import { Permission } from '../../entities/permission.entity';
import { RolePermission } from '../../entities/role-permission.entity';
import { Role } from '../../entities/role.entity';
import { User } from '../../entities/user.entity';
import { hash } from '../../shared/utils/bcypt.util';

export default class InitialDatabaseSeed implements Seeder {
  async run(dataSource: DataSource) {
    const permissionResource = await dataSource
      .getRepository(PermissionResource)
      .save({ name: 'Post' });

    const permission = await dataSource
      .getRepository(Permission)
      .save({ action: 'create', permissionResourceId: permissionResource.id });

    const role = await dataSource.getRepository(Role).save({ name: 'admin' });

    await dataSource
      .getRepository(RolePermission)
      .save({ permissionId: permission.id, roleId: role.id });

    await dataSource.getRepository(User).save({
      code: '1',
      email: 'bk@gmail.com',
      password: await hash('password'),
      username: 'bk',
      roleId: role.id,
    });
  }
}
