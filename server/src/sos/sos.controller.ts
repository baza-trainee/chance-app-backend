import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import RequestWithSession from '../auth/interfaces/req-with-session.interface';
import { CookieAuthenticationGuard } from '../auth/guards/coockie.guard';
import { SosService } from './sos.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@ApiTags('user')
@Controller('user')
@ApiCookieAuth()
@UseGuards(CookieAuthenticationGuard)
export class SosController {
  constructor(private readonly sosService: SosService) {}
  @Get()
  async getMyContcats(@Req() request: RequestWithSession) {
    return await this.sosService.getMyContacts(request.user.id);
  }
  @Post()
  async createContact(
    @Req() request: RequestWithSession,
    @Body() createContactDto: CreateContactDto,
  ) {
    return await this.sosService.createContact(
      request.user.id,
      createContactDto,
    );
  }
  @Post('/group')
  async createGroup(
    @Req() request: RequestWithSession,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return await this.sosService.createGroup(request.user.id, createGroupDto);
  }
  @Delete('/:id')
  async deleteContact(
    @Req() request: RequestWithSession,
    @Param('id') id: string,
  ) {
    return await this.sosService.deleteContact(id, request.user.id);
  }
  @Delete('/group/:id')
  async deleteGroup(
    @Req() request: RequestWithSession,
    @Param('id') id: string,
  ) {
    return await this.sosService.deleteGroup(id, request.user.id);
  }
  @Patch('/:id')
  async updateContact(
    @Req() request: RequestWithSession,
    updateContactDto: UpdateContactDto,
    @Param('id') id: string,
  ) {
    return await this.sosService.updateContact(
      id,
      request.user.id,
      updateContactDto,
    );
  }
  @Patch('/group/:id')
  async updateGroup(
    @Req() request: RequestWithSession,
    updateGroupDto: UpdateGroupDto,
    @Param('id') id: string,
  ) {
    return await this.sosService.updateGroup(
      id,
      request.user.id,
      updateGroupDto,
    );
  }
}
