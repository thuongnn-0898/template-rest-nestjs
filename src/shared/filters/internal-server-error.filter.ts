import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { HTTP_ERR_MSGS } from '../constants/error.constant';
import { LoggerConstant } from '../constants/logger.constant';
import { ErrorResponseDto } from '../dtos/error-response.dto';
import { ErrorDto } from '../dtos/error.dto';
import { FilterType } from '../types/FilterType';
import { internalServerError } from '../ultils/error.util';

@Catch()
export class InternalServerErrorFilter implements ExceptionFilter {
  constructor(private readonly filterParam: FilterType) {}

  catch(exception: any, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam;
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error: ErrorDto = internalServerError();

    logger.error(
      LoggerConstant.internalServer,
      undefined,
      asyncRequestContext.getRequestIdStore(),
    );

    response.status(status).json({
      errors: [error],
      message: HTTP_ERR_MSGS[status],
    } as ErrorResponseDto);
  }
}
