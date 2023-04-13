import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { FilterType } from '../types/FilterType';
import { LoggerConstant } from '../constants/logger.constant';
import { ErrorConstant } from '../../errors/error.constant';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  constructor(private readonly filterParam: FilterType) {}

  catch(exception: any, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.FORBIDDEN;

    logger.error(
      LoggerConstant.forbidden,
      undefined,
      asyncRequestContext.getRequestIdStore(),
    );

    response.status(status).json({
      statusCode: status,
      message: ErrorConstant.forbidden,
    });
  }
}
