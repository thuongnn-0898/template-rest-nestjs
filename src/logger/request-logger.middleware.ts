import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 } from 'uuid';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import isEmpty from 'lodash/isEmpty';

import { AsyncRequestContext } from '../async-request-context/async-request-context.service';
import { LoggerConstant } from '../shared/constants/logger.constant';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly asyncRequestContext: AsyncRequestContext,
  ) {}

  use(req: Request, _res: Response, next: NextFunction) {
    if (
      !isEmpty(req.body) &&
      req.body.operationName !== LoggerConstant.introspectionQuery
    ) {
      const requestId = v4();

      this.logger.log(`[API]: ${req.baseUrl}`, requestId);
      this.logger.log(
        `[Params]: ${JSON.stringify(req.body || req.params)}`,
        requestId,
      );
      this.asyncRequestContext.set(requestId);
    }

    next();
  }
}
