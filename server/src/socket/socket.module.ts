import { Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { ChatGateway } from './socket.service';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Session } from 'src/auth/session/session.model';
import { WsJwtGuard } from 'src/auth/guards/ws.guard';

@Module({
  imports: [MessageModule, TypegooseModule.forFeature([Session])],
  providers: [ChatGateway, WsJwtGuard],
})
export class SocketModule {}
