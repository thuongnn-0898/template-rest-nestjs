import { Logger } from 'winston';

import { AsyncRequestContext } from '../../async-request-context/async-request-context.service';

export type FilterType = {
  asyncRequestContext: AsyncRequestContext;
  logger: Logger;
};
