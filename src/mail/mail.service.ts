import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendTestMail(data: { email: string; url: string }) {
    try {
      const { email, url } = data;
      await this.mailerService.sendMail({
        to: `${email}`,
        subject: 'This is test mail',
        template: './test',
        context: {
          url,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
}
