import { InjectModel } from '@m8a/nestjs-typegoose';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Message } from './model/message.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message)
    private readonly messageModel: ReturnModelType<typeof Message>,
  ) {}

  async getMyMessageWithUser(myUserId: string, otherUserId: string) {
    const messages = await this.messageModel
      .find({
        fromUserId: myUserId,
        toUserId: otherUserId,
      })
      .populate('fromUserId', 'name _id')
      .populate('toUserId', 'name _id')
      .exec();

    if (!messages || messages.length === 0) {
      throw new NotFoundException('No messages found');
    }

    return messages;
  }

  async createMessage(dto: CreateMessageDto) {
    const message = await this.messageModel.create({ ...dto });
    return message;
  }

  async findOneMessage(userId: string, id: string) {
    const message = await this.messageModel.findOne({ _id: id }).exec();

    if (!message) {
      throw new NotFoundException('No messages found');
    }

    if (userId !== message.fromUserId.toString())
      throw new ForbiddenException(
        'У вас немає прав на перегляд цього повідомлення',
      );

    return message;
  }

  async updateMessage(
    userId: string,
    messageid: string,
    dto: UpdateMessageDto,
  ) {
    const message = await this.findOneMessage(userId, messageid);
    message.message = dto.newMessage;
    await message.save();

    return message;
  }

  async deleteMessage(userId: string, messageId: string) {
    const message = await this.findOneMessage(userId, messageId);
    await message.deleteOne();
    return { message: 'Повідомлення видалено' };
  }
}
