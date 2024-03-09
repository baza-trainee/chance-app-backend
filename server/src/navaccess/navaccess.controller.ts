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
import { NavaccessService } from './navaccess.service';
import RequestWithSession from 'src/auth/interfaces/req-with-session.interface';
import { CreateNavvaccessDto } from './dto/create-navacces.dto';
import { ApiTags, ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { CookieAuthenticationGuard } from 'src/auth/guards/coockie.guard';

@ApiTags('navaccess')
@Controller('navaccess')
@ApiCookieAuth()
@UseGuards(CookieAuthenticationGuard)
export class NavaccessController {
  constructor(private readonly navaccesService: NavaccessService) {}

  @Post()
  async createNavAccess(
    @Req() req: RequestWithSession,
    @Body() body: CreateNavvaccessDto,
  ) {
    return await this.navaccesService.create(body, req.user.id);
  }

  @ApiOperation({
    summary: 'Отримуєте обєкт запрошення у якому ви є одним з отримувачів.',
  })
  @Get('/for-me')
  async getMyAccess(@Req() req: RequestWithSession) {
    return await this.navaccesService.getMyAccess(req.user.id);
  }

  @ApiOperation({
    summary: 'Отримуєте обєкт(и) запрошення які ви створили.',
  })
  @Get('/from-me')
  async getAccesFromMe(@Req() req: RequestWithSession) {
    return this.navaccesService.getAccesFromMe(req.user.id);
  }

  @ApiOperation({
    summary:
      'Підтверджуєте свій статус запрошення де navaccessId - id запрошення.',
  })
  @Patch('/:navaccessId/accept')
  async acceptInvitation(
    @Param('navaccessId') navaccessId: string,
    @Req() req: RequestWithSession,
  ) {
    return await this.navaccesService.acceptInvitation(
      navaccessId,
      req.user.id,
    );
  }
  @ApiOperation({
    summary:
      'Відхиляєте свій статус запрошення де navaccessId - id запрошення.',
  })
  @Patch('/:navaccessId/reject')
  async rejecttInvitation(
    @Param('navaccessId') navaccessId: string,
    @Req() req: RequestWithSession,
  ) {
    return await this.navaccesService.rejectInvitation(
      navaccessId,
      req.user.id,
    );
  }

  @Delete('/:navaccessId')
  async deleteNavAccesById(
    @Param('navaccessId') navaccessId: string,
    @Req() req: RequestWithSession,
  ) {
    return await this.navaccesService.deleteNavAccesById(
      navaccessId,
      req.user.id,
    );
  }
}
