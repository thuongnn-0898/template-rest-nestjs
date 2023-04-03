import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import { QueryLogger } from './query-logger';
import { loggerOption } from './logger.option';

@Module({
  imports: [WinstonModule.forRootAsync({ useFactory: () => loggerOption })],
  providers: [QueryLogger],
  exports: [QueryLogger],
})
export class LoggerModule {}
