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
import { ErrorUtil } from '../utils/error.util';

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
    let status: number;

    if (errors) {
      status = HttpStatus.BAD_REQUEST;
      logger.error(
        LoggerConstant.queryFailed,
        undefined,
        asyncRequestContext.getRequestIdStore(),
      );
    } else {
      errors = ErrorUtil.internalServerError();
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      logger.error(
        LoggerConstant.internalServer,
        null,
        asyncRequestContext.getRequestIdStore(),
      );
    }

    return response.status(status).json(errors);
  }

  private queryFailedError(
    exception: any,
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
