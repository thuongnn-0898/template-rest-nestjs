import { hostname } from 'os';
import { red, green } from 'cli-color';
import { format } from 'winston';
import { PlatformTools } from 'typeorm/platform/PlatformTools';

import { LoggerConstant } from '../shared/constants/logger.constant';

const loggerFormatWithColor = format.printf(
  ({ context, level, timestamp, message }): string => {
    const hostName = `[${hostname()}]`;
    timestamp = `[${timestamp}]`;

    switch (level) {
      case LoggerConstant.infoLevel:
        level = green(`[${level.toUpperCase()}]`);
        context = green(`[${context}]`);

        if (message.startsWith(LoggerConstant.queryPrefix)) {
          message = PlatformTools.highlightSql(message);
        }
        break;
      case LoggerConstant.errorLevel:
        level = red(`[${level.toUpperCase()}]`);
        context = red(`[${context}]`);
        break;
    }

    return `${level}\t${hostName}\t${timestamp}\t${context}\t${message}`;
  },
);

const loggerFormatWithoutColor = format.printf(
  ({ context, level, timestamp, message }): string => {
    const hostName = `[${hostname}]`;
    timestamp = `[${timestamp}]`;
    level = `[${level.toUpperCase()}]`;
    context = `[${context}]`;

    return `${level}\t${hostName}\t${timestamp}\t${context}\t${message}`;
  },
);

export const loggerFormat =
  process.env.NODE_ENV === 'development'
    ? loggerFormatWithColor
    : loggerFormatWithoutColor;
