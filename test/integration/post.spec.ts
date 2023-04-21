import { HttpStatus, INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { setDataSource } from 'typeorm-extension';

import {
  create,
  createMany,
  getJWTResponse,
  initApp,
  initDataSource,
  make,
  mockFileValidationPipe,
  mockJwtVerified,
  mockPoliciesGuard,
  mockSendMail,
  mockWriteAndDeleteFile,
} from '../helper';
import { User } from '../../src/entities/user.entity';
import { hash } from '../../src/shared/utils/bcypt.util';
import { Role } from '../../src/entities/role.entity';
import { AuthErrorConstant } from '../../src/errors/auth-errors.constant';
import { Post } from '../../src/entities/post.entity';
import { Tag } from '../../src/entities/tag.entity';
import { ErrorConstant } from '../../src/errors/error.constant';

describe('Post controller', () => {
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
      password: await hash('12341234'),
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

  describe('show posts', () => {
    const route = 'posts/';
    let mockVerified = null;
    let mockPolicy = null;

    describe('Error', () => {
      describe('Invalid token', () => {
        it('Should return error when invalid token', async () => {
          const [status, res] = await getJWTResponse(app, 'get', route);

          expect(res.message).toEqual(AuthErrorConstant.invalidAccessToken);
          expect(status).toEqual(HttpStatus.UNAUTHORIZED);
        });
      });

      describe('Invalid permission', () => {
        beforeEach(() => {
          mockVerified = mockJwtVerified(user);
          mockPolicy = mockPoliciesGuard(false);
        });

        afterEach(() => {
          mockVerified.mockClear();
          mockPolicy.mockClear();
        });

        it('Should return error when invalid permission', async () => {
          const [status, res] = await getJWTResponse(app, 'get', route);

          expect(res.message).toEqual(ErrorConstant.forbidden);
          expect(status).toEqual(HttpStatus.FORBIDDEN);
        });
      });
    });

    describe('success', () => {
      let posts: Post[];
      let tags: Tag[];

      beforeEach(async () => {
        posts = await createMany<Post>(Post, 5, { userId: user.id });
        tags = await createMany<Tag>(Tag, 5, { postId: posts[0].id });
        mockVerified = mockJwtVerified(user);
        mockPolicy = mockPoliciesGuard(true);
      });

      afterEach(() => {
        mockVerified.mockClear();
        mockPolicy.mockClear();
      });
      it('Should show posts success', async () => {
        const [status, res] = await getJWTResponse(app, 'get', route);

        expect(res).toHaveLength(posts.length);
        expect(res).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: posts[0].id }),
          ]),
        );

        expect(res[0].tags).toEqual(
          expect.arrayContaining([expect.objectContaining({ id: tags[0].id })]),
        );

        expect(status).toEqual(HttpStatus.OK);
      });
    });
  });

  describe('create posts', () => {
    const route = 'posts/';

    let post: Post;

    beforeAll(async () => {
      post = await make<Post>(Post);
    });

    describe('Error', () => {
      let mockToken = null;
      let mockPolicy = null;
      let mockHandleFile = null;
      let mockMail = null;

      describe('Invalid token', () => {
        beforeEach(() => {
          mockHandleFile = mockWriteAndDeleteFile();
          mockMail = mockSendMail();
        });

        afterEach(() => {
          mockHandleFile.mockClear();
          mockMail.mockClear();
        });
        it('Should return error when invalid token', async () => {
          const [status, res] = await getJWTResponse(
            app,
            'post',
            route,
            post,
            Buffer.from('abc'),
          );

          expect(res.message).toEqual(AuthErrorConstant.invalidAccessToken);
          expect(status).toEqual(HttpStatus.UNAUTHORIZED);
        });
      });

      describe('Invalid permission', () => {
        beforeEach(() => {
          mockToken = mockJwtVerified(user);
          mockPolicy = mockPoliciesGuard(false);
        });

        afterEach(() => {
          mockToken.mockClear();
          mockPolicy.mockClear();
        });

        it('Should return error when invalid permission', async () => {
          const [status, res] = await getJWTResponse(
            app,
            'post',
            route,
            post,
            Buffer.from('abc'),
          );

          expect(res.message).toEqual(ErrorConstant.forbidden);
          expect(status).toEqual(HttpStatus.FORBIDDEN);
        });
      });
    });

    describe('success', () => {
      let mockToken = null;
      let mockPolicy = null;
      let mockFile = null;
      let mockHandleFile = null;
      let mockMail = null;

      beforeEach(() => {
        mockToken = mockJwtVerified(user);
        mockPolicy = mockPoliciesGuard(true);
        mockFile = mockFileValidationPipe();
        mockHandleFile = mockWriteAndDeleteFile();
        mockMail = mockSendMail();
      });

      afterEach(() => {
        mockToken.mockClear();
        mockPolicy.mockClear();
        mockFile.mockClear();
        mockHandleFile.mockClear();
        mockMail.mockClear();
      });
      it('Should show posts success', async () => {
        const [status, res] = await getJWTResponse(
          app,
          'post',
          route,
          post,
          Buffer.from('abc'),
        );

        expect(res).toEqual(expect.objectContaining({ title: post.title }));

        expect(status).toEqual(HttpStatus.CREATED);
      });
    });
  });

  describe('update posts', () => {
    let post: Post;
    let updatePost: Post;

    const route = `posts/${post.id}`;

    beforeAll(async () => {
      post = await create<Post>(Post);
      updatePost = await make<Post>(Post, { id: post.id });
    });

    describe('Error', () => {
      let mockToken = null;
      let mockPolicy = null;

      describe('Invalid token', () => {
        it('Should return error when invalid token', async () => {
          const [status, res] = await getJWTResponse(
            app,
            'patch',
            route,
            updatePost,
            Buffer.from('abc'),
          );

          expect(res.message).toEqual(AuthErrorConstant.invalidAccessToken);
          expect(status).toEqual(HttpStatus.UNAUTHORIZED);
        });
      });

      describe('Invalid permission', () => {
        beforeEach(() => {
          mockToken = mockJwtVerified(user);
          mockPolicy = mockPoliciesGuard(false);
        });

        afterEach(() => {
          mockToken.mockClear();
          mockPolicy.mockClear();
        });

        it('Should return error when invalid permission', async () => {
          const [status, res] = await getJWTResponse(
            app,
            'patch',
            route,
            updatePost,
            Buffer.from('abc'),
          );

          expect(res.message).toEqual(ErrorConstant.forbidden);
          expect(status).toEqual(HttpStatus.FORBIDDEN);
        });
      });
    });

    describe('success', () => {
      let mockToken = null;
      let mockPolicy = null;
      let mockFile = null;
      let mockHandleFile = null;
      let mockMail = null;

      beforeEach(() => {
        mockToken = mockJwtVerified(user);
        mockPolicy = mockPoliciesGuard(true);
        mockFile = mockFileValidationPipe();
        mockHandleFile = mockWriteAndDeleteFile();
        mockMail = mockSendMail();
      });

      afterEach(() => {
        mockToken.mockClear();
        mockPolicy.mockClear();
        mockFile.mockClear();
        mockHandleFile.mockClear();
        mockMail.mockClear();
      });
      it('Should show posts success', async () => {
        const [status, res] = await getJWTResponse(
          app,
          'patch',
          route,
          updatePost,
          Buffer.from('abc'),
        );

        expect(res).toEqual(
          expect.objectContaining({ title: updatePost.title }),
        );

        expect(res).toEqual(expect.objectContaining({ id: post.id }));

        expect(status).toEqual(HttpStatus.OK);
      });
    });
  });

  describe('delete post', () => {
    let post: Post;

    const route = `posts/${post.id}`;

    beforeAll(async () => {
      post = await create<Post>(Post);
    });

    describe('Error', () => {
      let mockToken = null;
      let mockPolicy = null;

      describe('Invalid token', () => {
        it('Should return error when invalid token', async () => {
          const [status, res] = await getJWTResponse(
            app,
            'delete',
            route,
            post,
          );

          expect(res.message).toEqual(AuthErrorConstant.invalidAccessToken);
          expect(status).toEqual(HttpStatus.UNAUTHORIZED);
        });
      });

      describe('Invalid permission', () => {
        beforeEach(() => {
          mockToken = mockJwtVerified(user);
          mockPolicy = mockPoliciesGuard(false);
        });

        afterEach(() => {
          mockToken.mockClear();
          mockPolicy.mockClear();
        });

        it('Should return error when invalid permission', async () => {
          const [status, res] = await getJWTResponse(
            app,
            'patch',
            route,
            post,
            Buffer.from('abc'),
          );

          expect(res.message).toEqual(ErrorConstant.forbidden);
          expect(status).toEqual(HttpStatus.FORBIDDEN);
        });
      });
    });

    describe('success', () => {
      let mockToken = null;
      let mockPolicy = null;
      let mockFile = null;
      let mockHandleFile = null;
      let mockMain = null;

      beforeEach(() => {
        mockToken = mockJwtVerified(user);
        mockPolicy = mockPoliciesGuard(true);
        mockFile = mockFileValidationPipe();
        mockHandleFile = mockWriteAndDeleteFile();
        mockMain = mockSendMail();
      });

      afterEach(() => {
        mockToken.mockClear();
        mockPolicy.mockClear();
        mockFile.mockClear();
        mockHandleFile.mockClear();
        mockMain.mockClear();
      });
      it('Should show posts success', async () => {
        const [status, res] = await getJWTResponse(
          app,
          'patch',
          route,
          post,
          Buffer.from('abc'),
        );

        expect(res).toBeTruthy();

        expect(status).toEqual(HttpStatus.OK);
      });
    });
  });
});
