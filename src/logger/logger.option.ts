import { format, transports } from 'winston';
import { WinstonModuleOptions } from 'nest-winston';

import { loggerFormat } from './logger.format';

const formatted = () => {
  return new Date().toLocaleString('en-US', {
    timeZone: process.env.TZ,
  });
};

export const loggerOption: WinstonModuleOptions = {
  silent: process.env.NODE_ENV === 'test',
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: formatted }),
        loggerFormat,
      ),
    }),
  ],
};
