import { NestFactory } from '@nestjs/core';
import {
  ValidationPipe,
  BadRequestException,
  RequestMethod,
  HttpStatus,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import { json } from 'body-parser';

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
import { ErrorConstant } from './shared/constants/error.constant';
import { AppConStant } from './shared/constants/app.constant';
import { ProcessLogger } from './logger/process.logger';

async function bootstrap() {
  const jsonParseMiddleware = json({ limit: AppConStant.jsonBodySizeLimit });
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: WinstonModule.createLogger(loggerOption),
  });

  const filterParam = {
    asyncRequestContext: app.get(AsyncRequestContext),
    logger: app.get(WINSTON_MODULE_NEST_PROVIDER),
  };

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '/auth/:splat*', method: RequestMethod.ALL }],
  });

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
        new BadRequestException(errors, ErrorConstant[HttpStatus.BAD_REQUEST]),
    }),
  );

  app.enableCors({ credentials: true });
  app.use(jsonParseMiddleware);
  ProcessLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(3000);
}
bootstrap();
