import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoggerConstant } from '../shared/constants/logger.constant';
import { FilterType } from '../shared/types/FilterType';

@Injectable()
export class ResponseLoggerInterceptor implements NestInterceptor {
  constructor(private readonly filterParam: FilterType) {}

  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    const { logger, asyncRequestContext } = this.filterParam;
    return next.handle().pipe(
      tap(() => {
        logger.log(
          LoggerConstant.success,
          asyncRequestContext.getRequestIdStore(),
        );
      }),
    );
  }
}
