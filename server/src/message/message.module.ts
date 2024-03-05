import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './model/message.model';
import { TypegooseModule } from '@m8a/nestjs-typegoose';

@Module({
  imports: [TypegooseModule.forFeature([Message])],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
