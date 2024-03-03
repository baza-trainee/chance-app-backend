import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { IEnv } from 'src/configs/env.config';
import { SendConfirmationEmail } from './dto/send-confrimation-email.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class MailService {
  private readonly from: string;
  constructor(
    @Inject('mailer') private readonly mailer: Transporter,
    private readonly configService: ConfigService<IEnv>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    this.from = this.configService.get('SMTP_USER');
  }

  //TODO add queue and send mails throug queue

  async sendConfirmationEmail(sendConfirmationEmail: SendConfirmationEmail) {
    this.mailer.sendMail({
      to: sendConfirmationEmail.email,
      from: this.from,
      text: sendConfirmationEmail.code,
      html: `
      <head>
      <body>
      <h3 style="text-align: center;">${sendConfirmationEmail.code}</h3>
      </body>
      </head>
`,
      subject: 'Confirmation Email',
    });
  }

  async sendPasswordResetCode(sendConfirmationEmail: SendConfirmationEmail) {
    this.mailer.sendMail({
      to: sendConfirmationEmail.email,
      from: this.from,
      html: `
      <head>
      <body>
      <p style="text-align: center;">Для відновлення вашого доступу в застосунок, надсилаємо вам цей одноразовий пароль:</p>
      <h3 style="text-align: center;">${sendConfirmationEmail.code}</h3></body>
      </head>            
      `,
      subject: 'Password reset code',
    });
  }

  async sendChangeEmailCode(email: string, code: string) {
    this.mailer.sendMail({
      to: email,
      from: this.from,
      text: `${code}`,
      subject: 'Change email request',
    });
  }

  async sendEmailChanged(email: string, oldEmail: string) {
    this.mailer.sendMail({
      to: oldEmail,
      from: this.from,
      html: `
      <head>
      <body>
      <p style="text-align: center;">Ваш логін (емейл) для доступу у застосунок щойно було змінено на наступний:</p>
      <h3 style="text-align: center;">${email}</h3>
      </div>
      </body>
      </head>
      `,
      subject: 'Email changed',
    });
  }
}
