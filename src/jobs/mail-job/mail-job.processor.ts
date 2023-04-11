import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { DoneCallback, Job } from 'bull';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

import { mailJobConstant } from './mail-job.constant';
import { LoggerConstant } from '../../shared/constants/logger.constant';

@Processor(mailJobConstant.name)
export class MailJobProcessor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly mailerService: MailerService,
  ) {}

  @Process(mailJobConstant.sendMailProcess)
  async sendMail(job: Job, done: DoneCallback) {
    try {
      const { data }: { data: ISendMailOptions } = job;
      const { to, subject, text, template, context } = data;

      this.mailerService.sendMail({
        to,
        subject,
        text,
        template,
        context,
      });
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
