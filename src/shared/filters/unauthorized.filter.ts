import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

import errorMessageConstant from '../constants/error-message.constant';
import { HTTP_ERR_MSGS } from '../constants/error.constant';
import { LoggerConstant } from '../constants/logger.constant';
import { ErrorResponseDto } from '../dtos/error-response.dto';
import { ErrorDto } from '../dtos/error.dto';
import { FilterType } from '../types/FilterType';

@Catch(UnauthorizedException)
export class UnauthorizedFilter implements ExceptionFilter {
  constructor(private readonly filterParam: FilterType) {}

  catch(exception: any, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam;
    const ctx = host.switchToHttp();
    const error: ErrorDto = exception.getResponse();
    const status = exception.getStatus();
    const response = ctx.getResponse<Response>();

    error.message = errorMessageConstant[error.code];

    const errorResponse: ErrorResponseDto = {
      errors: [error],
    };

    logger.error(
      LoggerConstant.unauthorized,
      undefined,
      asyncRequestContext.getRequestIdStore(),
    );

    return response.status(status).json({
      messages: HTTP_ERR_MSGS[status],
      errors: errorResponse,
    });
  }
}
