import { ISendMailOptions } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { mailJobConstant } from './mail-job.constant';

@Injectable()
export class MailJobService {
  constructor(
    @InjectQueue(mailJobConstant.name) private readonly queue: Queue,
  ) {}

  async sendMailJob(data: ISendMailOptions) {
    await this.queue.add(mailJobConstant.sendMailProcess, data, {
      attempts: mailJobConstant.maximumAttempts,
      removeOnComplete: true,
    });
  }
}
