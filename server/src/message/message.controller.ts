import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CookieAuthenticationGuard } from 'src/auth/guards/coockie.guard';
import RequestWithSession from 'src/auth/interfaces/req-with-session.interface';
import { MessageService } from './message.service';
import { UpdateMessageDto } from './dto/update-message.dto';

@ApiTags('message')
@Controller('message')
@ApiCookieAuth()
@UseGuards(CookieAuthenticationGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/:id')
  @ApiOperation({
    summary:
      'Параметр id - id користувача, з яким потрібно отримати всі повідомлення.',
  })
  async getMessageWithUser(
    @Req() request: RequestWithSession,
    @Param('id') id: string,
  ) {
    return await this.messageService.getMyMessageWithUser(request.user.id, id);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Параметр id - id повідомлення, яке потрібно оновити.',
  })
  async updateMessage(
    @Req() request: RequestWithSession,
    @Param('id') id: string,
    @Body() dto: UpdateMessageDto,
  ) {
    return await this.messageService.updateMessage(request.user.id, id, dto);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Параметр id - id повідомлення, яке потрібно видалити',
  })
  async deleteMessage(
    @Req() request: RequestWithSession,
    @Param('id') id: string,
  ) {
    return await this.messageService.deleteMessage(request.user.id, id);
  }
}
