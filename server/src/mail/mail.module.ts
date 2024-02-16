import { Module, forwardRef } from '@nestjs/common';
import { nodemailerFactory } from './mail.provider';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
  ],
  providers: [
    {
      provide: 'mailer',
      useFactory: nodemailerFactory,
      inject: [ConfigService],
    },
    MailService,
  ],
  exports: [MailService],
})
export class MailModule {}
