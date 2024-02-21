import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { User } from './models/user.model';
import { MailModule } from 'src/mail/mail.module';
import { UserController } from './user.controller';
import { TaskModule } from '../task/task.module';

@Module({
  controllers: [UserController],
  imports: [
    TypegooseModule.forFeature([User]),
    forwardRef(() => MailModule),
    forwardRef(() => TaskModule),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
