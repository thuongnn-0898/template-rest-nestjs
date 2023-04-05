import { QueryFailedError } from 'typeorm/error/QueryFailedError';
import { Response } from 'express';
import camelCase from 'lodash/camelCase';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

import { FilterType } from '../types/FilterType';
import { ErrorConstant } from '../../errors/error.constant';
import { LoggerConstant } from '../constants/logger.constant';

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
  constructor(private readonly filterParam: FilterType) {}

  catch(exception: any, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errors = this.queryFailedError(
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
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      logger.error(
        LoggerConstant.internalServer,
        null,
        asyncRequestContext.getRequestIdStore(),
      );
    }

    return response
      .status(status)
      .json({ statusCode: status, message: ErrorConstant.alreadyExist });
  }

  private queryFailedError(exception: any, errorCode: number, entity: string) {
    switch (errorCode) {
      case 23505: {
        const message = ErrorConstant.uniqueViolation;
        const property = camelCase(
          exception.detail
            .match(ErrorConstant.GetPropertyInMessageRegex)[1]
            .split(', ')
            .pop(),
        );

        return { message, entity, property };
      }
    }
  }
}
