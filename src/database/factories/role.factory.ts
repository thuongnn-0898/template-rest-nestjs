import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';

import { Role } from '../../entities/role.entity';

export default setSeederFactory(Role, async (faker: Faker) => {
  const role = new Role();
  role.name = faker.lorem.word();
  return role;
});
