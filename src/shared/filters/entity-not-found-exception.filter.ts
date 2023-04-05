import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { Response } from 'express';

import { FilterType } from '../types/FilterType';
import { LoggerConstant } from '../constants/logger.constant';
import { ErrorConstant } from '../../errors/error.constant';

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  constructor(private readonly filterParam: FilterType) {}

  catch(exception: any, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.NOT_FOUND;

    logger.error(
      LoggerConstant.notFound,
      undefined,
      asyncRequestContext.getRequestIdStore(),
    );

    response.status(status).json({
      statusCode: status,
      message: ErrorConstant.entityNotFound,
    });
  }
}
