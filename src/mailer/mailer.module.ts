import { createTransport } from 'nodemailer';
import { DynamicModule } from '@nestjs/common';
import { MailerService } from './mailer.service';

type MailberModuleOptions = {
  isGlobal?: boolean;
};

export class MailerModule {
  static forRoot(options?: MailberModuleOptions): DynamicModule {
    const isGlobal = options?.isGlobal ?? true;

    return {
      module: MailerModule,
      global: isGlobal,
      providers: [
        {
          provide: MailerService,
          useValue: new MailerService(
            createTransport({
              host: process.env.MAIL_HOST,
              port: process.env.MAIL_PORT,
              auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
              },
            }),
          ),
        },
      ],
      exports: [MailerService],
    };
  }
}
