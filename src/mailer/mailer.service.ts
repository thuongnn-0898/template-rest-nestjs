import { BadRequestException } from '@nestjs/common';
import { createTransport } from 'nodemailer';

import { attachmentType } from '../jobs/job.type';

export class MailerService {
  constructor(private readonly transport: createTransport) {}

  async sendMail(
    toAddresses: string[],
    subject: string,
    text?: string,
    html?: string,
    attachments?: attachmentType[],
    retry = 0,
  ) {
    const params = {
      from: process.env.MAIL_FROM,
      to: toAddresses.join(),
      subject,
      text,
      html,
      attachments,
    };
    let transporter;

    try {
      transporter = this.transport;
      const { messageId, response } = await transporter.sendMail(params);

      return { id: messageId, message: response };
    } catch ({ message }) {
      if (retry < 4) {
        return await this.sendMail(
          toAddresses,
          subject,
          text,
          html,
          attachments,
          ++retry,
        );
      }
      // Send mail error
      throw new BadRequestException(message);
    } finally {
      transporter.close();
    }
  }
}
