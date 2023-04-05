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
import { UnauthorizedExceptionFilter } from './shared/filters/unauthorized-exception.filter';
import { EntityNotFoundExceptionFilter } from './shared/filters/entity-not-found-exception.filter';
import { InternalServerErrorExceptionFilter } from './shared/filters/internal-server-error-exception.filter';
import { NotFoundFilter } from './shared/filters/not-found-exception.filter';
import { AppConStant } from './shared/constants/app.constant';
import { ProcessLogger } from './logger/process.logger';
import { ErrorConstant } from './errors/error.constant';

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
    new InternalServerErrorExceptionFilter(filterParam),
    new NotFoundFilter(filterParam),
    new QueryFailedErrorFilter(filterParam),
    new BadRequestExceptionFilter(filterParam),
    new UnauthorizedExceptionFilter(filterParam),
    new EntityNotFoundExceptionFilter(filterParam),
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
