import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { get, result } from 'lodash';

import messages from '../constants/error-message.constant';
import { getObjectByKey, getKey } from '../ultils/app.util';
import { ErrorConstant } from '../constants/error.constant';
import { ErrorDto } from '../dtos/error.dto';
import { ErrorResponseDto } from '../dtos/error-response.dto';
import { LoggerConstant } from '../constants/logger.constant';
import { FilterType } from '../types/FilterType';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  constructor(private readonly filterParam: FilterType) {}

  catch(exception: any, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam;
    const ctx = host.switchToHttp();
    let exceptionRes = exception.getResponse();
    const response = ctx.getResponse<Response>();
    let errRes: ErrorResponseDto = null;

    if (
      Array.isArray(exceptionRes.message) &&
      exceptionRes.message[0] instanceof ValidationError
    ) {
      exceptionRes = getObjectByKey(exceptionRes, 'constraints');

      const errs = exceptionRes.map((element: ValidationError, i: number) => {
        const { code } = Object.assign(
          {},
          result(
            ErrorConstant,
            getKey(element.constraints, Object.values(element.constraints)[0]),
          ),
        ) as ErrorDto;

        if (code) {
          const resource = get(element, 'target.constructor.resource');
          const arrayError = get(element, 'message[0].children');

          return {
            code,
            index:
              Array.isArray(arrayError) && arrayError[i]?.property
                ? (arrayError[i].property as unknown as number)
                : null,
            resource: resource != undefined ? resource : null,
            field: element.property,
            message: messages[code],
          };
        } else {
          return {
            resource: get(element, 'target.constructor.resource'),
            message: 'error undefined',
            field: element.property,
          };
        }
      });

      if (errs.length) {
        const message = exception.getResponse().error;

        errRes = { status: HttpStatus.BAD_REQUEST, errors: errs, message };
      }
    } else {
      errRes = { status: HttpStatus.BAD_REQUEST, errors: exceptionRes };
    }

    if (!errRes) {
      logger.error(
        LoggerConstant.notFoundErrorResponse,
        undefined,
        asyncRequestContext.getRequestIdStore(),
      );

      const status = HttpStatus.INTERNAL_SERVER_ERROR;

      const internalError = {
        status,
        code: `http-${status}`,
        message: exceptionRes.error,
      };

      response.status(status).json(internalError);
    } else {
      logger.error(
        LoggerConstant.badRequest,
        undefined,
        asyncRequestContext.getRequestIdStore(),
      );

      response.status(HttpStatus.BAD_REQUEST).json(errRes);
    }
  }
}
