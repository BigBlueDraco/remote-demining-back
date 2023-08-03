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
      });
    } catch (e) {
      console.log(e);
    }
  }
  async sendForgotPasswordMail(data: {
    email: string;
    url: string;
    name?: string;
  }) {
    try {
      const { email, url } = data;
      await this.mailerService.sendMail({
        to: `${email}`,
        subject: 'Forgot Password',
        template: './forgotPassword',
        context: {
          url,
          name: data?.name || 'Адміне',
        },
      });
    } catch (e) {}
  }
}
