import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from './datasource/config';
import { QueryLogger } from './logger/query-logger';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [LoggerModule],
      inject: [QueryLogger],
      useFactory: (logger: QueryLogger) => ({
        ...config,
        synchronize: false,
        logger,
      }),
    }),
  ],
})
export class DatabaseModule {}
