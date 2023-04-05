import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

import { LoggerConstant } from '../constants/logger.constant';
import { FilterType } from '../types/FilterType';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  constructor(private readonly filterParam: FilterType) {}

  catch(exception: any, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam;
    const ctx = host.switchToHttp();
    const error = exception.getResponse();
    const status = exception.getStatus();
    const response = ctx.getResponse<Response>();

    logger.error(
      LoggerConstant.unauthorized,
      undefined,
      asyncRequestContext.getRequestIdStore(),
    );

    return response.status(status).json({
      statusCode: status,
      message: error.message,
    });
  }
}
