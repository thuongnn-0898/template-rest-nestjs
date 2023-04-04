import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';

import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { loggerOption } from './logger/logger.option';
import { ResponseLoggerInterceptor } from './interceptors/response.interceptor';
import { AsyncRequestContext } from './async-request-context/async-request-context.service';
import { BadRequestExceptionFilter } from './shared/filters/bad-request-exception.filter';
import { QueryFailedErrorFilter } from './shared/filters/query-exception.filter';
import { UnauthorizedFilter } from './shared/filters/unauthorized.filter';
import { EntityNotFoundFilter } from './shared/filters/entity-not-found.filter';
import { InternalServerErrorFilter } from './shared/filters/internal-server-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerOption),
  });

  const filterParam = {
    asyncRequestContext: app.get(AsyncRequestContext),
    logger: app.get(WINSTON_MODULE_NEST_PROVIDER),
  };

  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ResponseLoggerInterceptor(filterParam),
  );

  app.useGlobalFilters(
    new InternalServerErrorFilter(filterParam),
    new QueryFailedErrorFilter(filterParam),
    new BadRequestExceptionFilter(filterParam),
    new UnauthorizedFilter(filterParam),
    new EntityNotFoundFilter(filterParam),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) =>
        new BadRequestException(errors, 'Validation failed'),
    }),
  );
  await app.listen(3000);
}
bootstrap();
