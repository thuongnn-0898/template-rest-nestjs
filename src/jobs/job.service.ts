import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { jobConstant } from './job.constant';
import { jobDataType } from './job.type';

@Injectable()
export class JobService {
  constructor(@InjectQueue(jobConstant.name) private readonly queue: Queue) {}

  async sendMailJob(data: jobDataType[]) {
    await this.queue.add(jobConstant.sendMailProcess, data, {
      attempts: jobConstant.maximumAttempts,
      removeOnComplete: true,
    });
  }
}
