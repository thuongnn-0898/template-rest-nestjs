import {
  BadRequestException,
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import fs from 'fs';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DataSource, ObjectType } from 'typeorm';
import {
  resolveFilePaths,
  resolveFilePatterns,
  useSeederFactory,
} from 'typeorm-extension';
import { load } from 'locter';

import { AppModule } from '../src/app.module';
import { AsyncRequestContext } from '../src/async-request-context/async-request-context.service';
import { BadRequestExceptionFilter } from '../src/shared/filters/bad-request-exception.filter';
import AppDataSource from '../src/datasource/index';
import { ErrorDto } from '../src/shared/dtos/error.dto';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { User } from '../src/entities/user.entity';
import { hash } from '../src/shared/utils/bcypt.util';
import { PoliciesGuard } from '../src/shared/guards/policies.guard';
import { ForbiddenExceptionFilter } from '../src/shared/filters/forbidden-exception.filter';
import { FileSizeValidationPipe } from '../src/shared/pipes/file-validation.pipe';
import { PostService } from '../src/post/post.service';

export declare type EntityProperty<Entity> = {
  [Property in keyof Entity]?: Entity[Property];
};

export const initApp = async (): Promise<INestApplication> => {
  await mockFs();
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  const filterParam = {
    asyncRequestContext: app.get(AsyncRequestContext),
    logger: app.get(WINSTON_MODULE_NEST_PROVIDER),
  };

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  app.useGlobalFilters(
    new BadRequestExceptionFilter(filterParam),
    new ForbiddenExceptionFilter(filterParam),
  );

  await setFactories(['src/database/factories/*.factory.ts']);
  await app.init();

  return app;
};

export const getJWTResponse = async (
  app: INestApplication,
  method: string,
  route: string,
  variables: any = {},
  file?: Buffer,
  token = '',
) => {
  route = route.startsWith('/') ? route : `/${route}`;

  const req = await request(app.getHttpServer())
    [method](route)
    .set('Authorization', `Bearer ${token}`)
    .set('x-authorization', token)
    .set('cookie', `accessToken=${token}`);

  const { status, text, header } = file
    ? req
        .set('content-type', 'multipart/form-data')
        .attach('file', file)
        .field(variables)
    : req.query(variables).send({ ...variables });

  return [status, isJsonString(text) ? JSON.parse(text) : text, header];
};

export const initDataSource = async (): Promise<DataSource> => {
  if (!AppDataSource?.isInitialized) {
    await AppDataSource.initialize();
  }

  return AppDataSource;
};

export const formatError = (
  code: string,
  message: string,
  property = null,
  resource = null,
  indexes = null,
) => {
  if (Array.isArray(indexes)) {
    return {
      errors: indexes.map((index) => {
        return { code, message, property, resource, index };
      }),
      data: null,
    };
  }

  return {
    errors: [{ code, message, property, resource, index: indexes }],
    data: null,
  };
};

export const formatMultipleError = (errors: ErrorDto[]) => {
  const objects = [];
  for (const error of errors) {
    const { message, property = null, resource = null, index = null } = error;
    objects.push({ resource, property, message, index });
  }

  return { errors: objects, data: null };
};

export const mockFs = async () => {
  jest.spyOn(fs, 'readFileSync').mockImplementation((path: string) => {
    if (path.includes('/auth') || path.includes('jwtRS256')) {
      return 'fake file content';
    }

    return;
  });
};

export async function create<T>(
  entity: ObjectType<T>,
  overrideParams?: EntityProperty<T>,
): Promise<T> {
  return useSeederFactory(entity).save(overrideParams);
}

export async function make<T>(
  entity: ObjectType<T>,
  overrideParams?: EntityProperty<T>,
): Promise<T> {
  return await useSeederFactory(entity).make(overrideParams);
}

export async function createMany<T>(
  entity: ObjectType<T>,
  amount = 1,
  overrideParams?: EntityProperty<T>,
): Promise<T[]> {
  return useSeederFactory(entity).saveMany(amount, overrideParams);
}

export const setFactories = async (factoryFiles: string[]): Promise<void> => {
  try {
    factoryFiles = await resolveFilePatterns(factoryFiles);
    factoryFiles = resolveFilePaths(factoryFiles);

    for (const factoryFile of factoryFiles) {
      await load(factoryFile);
    }
  } catch (error) {
    console.log(error);
  }
};

export const mockJwtVerified = (user: User = null) => {
  return jest
    .spyOn(JwtAuthGuard.prototype, 'canActivate')
    .mockImplementation(async (ctx: ExecutionContext) => {
      const req = ctx.switchToHttp().getRequest();
      req.user =
        user ||
        create<User>(User, {
          username: 'username',
          password: await hash('password'),
          code: 'code',
          email: 'email@example.com',
        });

      return Promise.resolve(true);
    });
};

export const mockPoliciesGuard = (bool: boolean) => {
  return jest
    .spyOn(PoliciesGuard.prototype, 'canActivate')
    .mockImplementation(async () => Promise.resolve(bool));
};

export const mockFileValidationPipe = () => {
  return jest
    .spyOn(FileSizeValidationPipe.prototype, 'transform')
    .mockImplementation(async (value: any, metadata) => {
      if (metadata.data === 'file') {
        return {
          size: 123456,
          mimetype: 'image/jpeg',
          buffer: Buffer.from('abc'),
        };
      }

      return value;
    });
};

export const mockWriteAndDeleteFile = () => {
  jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
    return 'fake write file';
  });

  jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {
    return 'fake write file';
  });
};

export const mockSendMail = () => {
  jest
    .spyOn(PostService.prototype as any, 'sendMailNoticeAboutCreatePost')
    .mockImplementation(() => {
      return 'fake write file';
    });
};

function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
}
