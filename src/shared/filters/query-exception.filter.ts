import { QueryFailedError } from 'typeorm/error/QueryFailedError';
import { Response } from 'express';
import camelCase from 'lodash/camelCase';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { FilterType } from '../types/FilterType';
import { ErrorConstant } from '../constants/error.constant';
import { ErrorDto } from '../dtos/error.dto';
import { LoggerConstant } from '../constants/logger.constant';
import { internalServerError } from '../ultils/error.util';

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
  constructor(private readonly filterParam: FilterType) {}

  catch(exception: any, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let errors = this.queryFailedError(
      exception,
      parseInt(exception.code, 0),
      exception.table,
    );
    let status;

    if (errors) {
      status = HttpStatus.BAD_REQUEST;
      logger.log(
        LoggerConstant.queryFailed,
        asyncRequestContext.getRequestIdStore(),
      );
    } else {
      errors = internalServerError();
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      logger.error(
        exception.stack,
        null,
        asyncRequestContext.getRequestIdStore(),
      );
    }
    return response.status(status).json(errors);
  }

  private queryFailedError(
    exception,
    errorCode: number,
    entity: string,
  ): ErrorDto {
    switch (errorCode) {
      case 23505: {
        const property = camelCase(
          exception.detail
            .match(ErrorConstant.GetPropertyInMessageRegex)[1]
            .split(', ')
            .pop(),
        );
        const { code, message } = ErrorConstant.uniqueViolation;
        return plainToInstance(ErrorDto, { code, message, entity, property });
      }
    }
  }
}
