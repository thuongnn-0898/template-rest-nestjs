import { DoneCallback, Job } from 'bull';
import { Inject, Logger } from '@nestjs/common';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { jobConstant } from './job.constant';
import { jobDataType } from './job.type';
import { LoggerConstant } from 'src/shared/constants/logger.constant';

@Processor(jobConstant.name)
export class JobProcessor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  @Process(jobConstant.sendMailProcess)
  async sendMail(job: Job, done: DoneCallback) {
    try {
      const { data }: { data: jobDataType } = job;
      console.log('job run with data: ' + JSON.stringify(data));
    } catch (error) {
      this.logging(error);
    }
    done();
  }

  @OnQueueFailed()
  async failed(error) {
    this.logging(error);
  }

  private logging(error) {
    if (error.query) {
      const { query, parameters } = error;
      const stringifyParams =
        parameters && parameters.length
          ? LoggerConstant.parameterPrefix + JSON.stringify(parameters)
          : '';
      const sql = LoggerConstant.queryPrefix + query + stringifyParams;

      this.logger.log(sql, LoggerConstant.backgroundJobContext);
    }

    this.logger.error(
      error.stack || error,
      null,
      LoggerConstant.backgroundJobContext,
    );
  }
}
