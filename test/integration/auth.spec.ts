import { HttpStatus, INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { setDataSource } from 'typeorm-extension';

import {
  create,
  getJWTResponse,
  initApp,
  initDataSource,
  mockJwtVerified,
} from '../helper';
import { User } from '../../src/entities/user.entity';
import { hash } from '../../src/shared/utils/bcypt.util';
import { Role } from '../../src/entities/role.entity';
import { AuthErrorConstant } from '../../src/errors/auth-errors.constant';

describe('Auth controller', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let server: any;
  let user: User;
  let role: Role;

  beforeAll(async () => {
    app = await initApp();
    server = app.getHttpServer();
    dataSource = await initDataSource();

    setDataSource(dataSource);

    role = await create<Role>(Role);
    user = await create<User>(User, {
      password: await hash('123456'),
      roleId: role.id,
    });
  });

  afterAll(async () => {
    server.close();
    jest.clearAllMocks();

    await dataSource.getRepository(User).delete({});
    await dataSource.getRepository(Role).delete({});
    await app.close();
  });

  describe('Signin', () => {
    const route = 'auth/login';

    describe('success', () => {
      it('Should login success', async () => {
        const [status, res] = await getJWTResponse(app, 'post', route, {
          username: user.username,
          password: '123456',
        });

        expect(res.accessToken).not.toBeNull();
        expect(res.refreshToken).not.toBeNull();
        expect(status).toEqual(HttpStatus.OK);
      });
    });

    describe('Error', () => {
      it('Should return error when wrong credentials', async () => {
        const [status, res] = await getJWTResponse(app, 'post', route, {
          username: user.username,
          password: '1234561',
        });

        expect(res.message).toEqual(AuthErrorConstant.wrongLoginInfo);
        expect(status).toEqual(HttpStatus.UNAUTHORIZED);
      });
    });
  });

  describe('Profile', () => {
    const route = 'auth/profile';
    let mock = null;

    describe('Error', () => {
      it('Should return error when invalid token', async () => {
        const [status, res] = await getJWTResponse(app, 'get', route);

        expect(res.message).toEqual(AuthErrorConstant.invalidAccessToken);
        expect(status).toEqual(HttpStatus.UNAUTHORIZED);
      });
    });

    describe('success', () => {
      beforeEach(() => {
        mock = mockJwtVerified(user);
      });

      afterEach(() => {
        mock.mockClear();
      });

      it('Should save patient success if params valid', async () => {
        const [status, res] = await getJWTResponse(app, 'get', route);

        expect(res.username).toEqual(user.username);
        expect(res.code).toEqual(user.code);
        expect(res.email).toEqual(user.email);
        expect(res.id).toEqual(user.id);
        expect(status).toEqual(HttpStatus.OK);
      });
    });
  });
});
