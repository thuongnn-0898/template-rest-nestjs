import { define } from 'typeorm-seeding';
import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';

import { User } from '../../entities/user.entity';
import { hash } from '../../shared/ultils/bcypt.util';

define(User, () => {
  const user = new User();
  user.code = '001';
  user.username = 'username';
  user.email = 'email@example.com';
  user.password = 'password';

  return user;
});

export default setSeederFactory(User, async (faker: Faker) => {
  const user = new User();
  user.code = faker.random.alphaNumeric(5);
  user.username = faker.internet.userName();
  user.email = faker.internet.email();
  user.password = await hash(faker.internet.password());
  return user;
});
