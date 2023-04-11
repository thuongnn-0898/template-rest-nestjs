import { MailerOptions } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

export const mailerConfig: MailerOptions = {
  transport: {
    host: process.env.MAIL_HOST,
    port: +process.env.MAIL_PORT,
  },
  defaults: {
    from: process.env.MAIL_FROM,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  },
  template: {
    dir: __dirname + '/templates',
    adapter: new EjsAdapter(),
    options: {
      strict: true,
    },
  },
};
