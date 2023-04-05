import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

import { ErrorConstant } from '../../errors/error.constant';
import { LoggerConstant } from '../constants/logger.constant';
import { FilterType } from '../types/FilterType';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  constructor(private readonly filterParam: FilterType) {}

  catch(exception: any, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam;
    const status = HttpStatus.NOT_FOUND;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    logger.error(
      LoggerConstant.notFound,
      undefined,
      asyncRequestContext.getRequestIdStore(),
    );

    response.status(status).json({
      statusCode: status,
      message: ErrorConstant.notFoundException,
    });
  }
}
