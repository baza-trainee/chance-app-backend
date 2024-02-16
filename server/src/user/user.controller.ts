import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateuserDto } from './dto/update-user.dto';
import { FinduserDto } from './dto/find-user.dto';
import RequestWithSession from '../auth/interfaces/req-with-session.interface';
import { CookieAuthenticationGuard } from '../auth/guards/coockie.guard';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCookieAuth()
  @UseGuards(CookieAuthenticationGuard)
  @Patch()
  @HttpCode(200)
  async updateuser(
    @Body() patchuserDto: UpdateuserDto,
    @Req() request: RequestWithSession,
  ) {
    return await this.userService.updateuser(patchuserDto, request.user.email);
  }

  // @ApiCookieAuth()
  @ApiOperation({ summary: 'Видалення аккаунта DEV MODE' })
  // @UseGuards(CookieAuthenticationGuard)
  @Delete('/:email')
  async deleteMyAccount(
    @Param('email') email: string,
    // @Req() request: RequestWithSession
  ) {
    console.log(email)
    return await this.userService.deleteUserDEV(email);
  }

 /*  @ApiOperation({ summary: 'Пошук за emailom' })
  @ApiCookieAuth()
  @UseGuards(CookieAuthenticationGuard)
  @Post('find')
  async findUser(@Body() finduserDto: FinduserDto) {
    const user = await this.userService.findByEmail(finduserDto.email);
    return user;
  }
  @ApiOperation({ summary: 'Пошук за id' })
  @ApiCookieAuth()
  @UseGuards(CookieAuthenticationGuard)
  @Get('id/:userId')
  async findUserById(@Param('userId') userId: string) {
    const user = await this.userService.findById(userId);
    return user;
  } */
  // @ApiCookieAuth()
  // @UseGuards(CookieAuthenticationGuard)
  // @Delete('/photo')
  // async deletePhoto(@Req() request: RequestWithSession) {
  //   await this.userService.deletePhoto(request.user.id);
  // }
}
