import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { Response } from 'express';

import { ErrorConstant, HTTP_ERR_MSGS } from '../constants/error.constant';
import { FilterType } from '../types/FilterType';
import { LoggerConstant } from '../constants/logger.constant';
import { ErrorDto } from '../dtos/error.dto';
import { ErrorResponseDto } from '../dtos/error-response.dto';
import errorMessageConstant from '../constants/error-message.constant';

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter implements ExceptionFilter {
  constructor(private readonly filterParam: FilterType) {}

  catch(exception: any, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error: ErrorDto = ErrorConstant.entityNotFound;
    const status = HttpStatus.NOT_FOUND;

    error.message = errorMessageConstant[error.code];
    error.resource = exception.message.match(
      ErrorConstant.getPropertyWhenNotFound,
    )[1];

    logger.error(
      LoggerConstant.notFound,
      undefined,
      asyncRequestContext.getRequestIdStore(),
    );

    response.status(status).json({
      errors: [error],
      message: HTTP_ERR_MSGS[status],
    } as ErrorResponseDto);
  }
}
