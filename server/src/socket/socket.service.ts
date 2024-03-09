/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { WebsocketExceptionFilter } from './ws-exception.filter';
import { Socket, Server } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { WsJwtGuard } from 'src/auth/guards/ws.guard';
import { ApiCookieAuth } from '@nestjs/swagger';

class ChatMessage {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  message: string;
  @IsNotEmpty()
  @IsString()
  toUserId: string;
  @IsOptional()
  geoData: {
    latitude: number;
    longitude: number;
  };
  @IsOptional()
  user: {
    id: string;
    email: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: '*',
    // origin: 'http://localhost:3001',
    credentials: true,
  },
})
@UseFilters(new WebsocketExceptionFilter())
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private messageService: MessageService) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(room);
  }

  @SubscribeMessage('text-chat')
  @ApiCookieAuth()
  @UseGuards(WsJwtGuard)
  @UsePipes(new ValidationPipe())
  async handleMessage(
    @MessageBody() message: ChatMessage,
    @ConnectedSocket() client: Socket,
    // @WsJwtGuardData() data: any,
  ) {
    const roomName = [message.user.id, message.toUserId].sort().join('-');

    console.log('Message:', message);
    const dbMessage = {
      message: message.message,
      fromUserId: message.user.id,
      geoData: message.geoData,
      toUserId: message.toUserId,
    };
    await this.messageService.createMessage(dbMessage);

    this.server.to(roomName).emit('text-chat', {
      ...message,
      time: new Date().toISOString(),
    });
  }
}
