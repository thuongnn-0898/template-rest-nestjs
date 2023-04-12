import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { MailJobService } from './mai-job.service';
import { mailJobConstant } from './mail-job.constant';
import { MailJobProcessor } from './mail-job.processor';
import { AppConStant } from '../../shared/constants/app.constant';

@Module({
  imports: [
    BullModule.registerQueue({
      name: mailJobConstant.name,
      redis: AppConStant.redis,
    }),
  ],
  providers: [MailJobService, MailJobProcessor],
  exports: [MailJobService],
})
export class MailJobModule {}
