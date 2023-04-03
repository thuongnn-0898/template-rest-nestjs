import { Inject, Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AdvancedConsoleLogger, LoggerOptions } from 'typeorm';

import { AsyncRequestContext } from '../async-request-context/async-request-context.service';
import { LoggerConstant } from '../shared/constants/logger.constant';

export class QueryLogger extends AdvancedConsoleLogger {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly asyncRequestContext: AsyncRequestContext,
  ) {
    super(LoggerConstant.queryLogLevels as LoggerOptions);
  }

  logQuery(query: string, parameters?: any[]) {
    const stringifyParams =
      parameters && parameters.length
        ? LoggerConstant.parameterPrefix + JSON.stringify(parameters)
        : '';
    const sql = LoggerConstant.queryPrefix + query + stringifyParams;

    this.logger.log(
      sql,
      this.asyncRequestContext.getRequestIdStore() ||
        LoggerConstant.typeOrmFirstQuery,
    );
  }
}
