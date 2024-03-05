import { InjectModel } from '@m8a/nestjs-typegoose';
import { Injectable } from '@nestjs/common';
import { Message } from './model/message.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message)
    private readonly messageModel: ReturnModelType<typeof Message>,
  ) {}

  async createMessage(dto: CreateMessageDto) {
    const message = await this.messageModel.create({ ...dto });
    return message;
  }
}
