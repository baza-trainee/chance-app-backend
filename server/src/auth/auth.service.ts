import { UserService } from './../user/user.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from '../mail/dto/reset-password.dto';
import {
  wrongCredentials,
  emailAlreadyTaken,
  notConfrimedAccount,
} from './utils/errors';
import RequestWithSession from './interfaces/req-with-session.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async loginOld(loginDto: LoginDto) {
    const user = await this.userService.findFullInfoByEmail(loginDto.email);
    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordCorrect) throw new UnauthorizedException(wrongCredentials);
    if (!user.isConfirmed) throw new BadRequestException(notConfrimedAccount);
    const jwt = await this.jwtService.sign({
      id: user._id,
      email: user.email,
    });
    return jwt;
  }

  async login(loginDto: LoginDto, request: RequestWithSession) {
    const jwt = this.jwtService.sign({
      id: request.user.id,
      email: request.user.email,
    });
    return {
      id: request.user.id,
      token: jwt,
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.userService.findFullInfoByEmail(
        registerDto.email,
      );
      if (!user.isConfirmed) await user.deleteOne();
    } catch (error) {}
    if (!(await this.userService.isEmailAvaliable(registerDto.email)))
      throw new BadRequestException(emailAlreadyTaken);
    return await this.userService.createuser(registerDto);
  }

  async getAuthenticatedUser(email: string, password: string) {
    const user = await this.userService.findFullInfoByEmail(email);
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      throw new UnauthorizedException('Неправильні данні');
    if (!user.isConfirmed) throw new BadRequestException(notConfrimedAccount);
    return user;
  }

  async confirmEmail(confirmEmailDto: ConfirmEmailDto) {
    await this.userService.confirmAccountByCode(confirmEmailDto);
    const user = await this.userService.findFullInfoByEmail(
      confirmEmailDto.email,
    );
    const jwt = await this.jwtService.sign({
      id: user._id,
      email: user.email,
    });
    return jwt;
  }

  async getMe(email: string) {
    const user = await this.userService.findByEmail(email);
    return user
  }

  async sendResetPasswordCode(
    requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    await this.userService.sendPasswordCode(requestPasswordResetDto.email);
  }

  async sendChangeEmailCode(
    userId: string,
    requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    await this.userService.sendChangeEmailCode(
      userId,
      requestPasswordResetDto.email,
    );
  }

  async changeEmail(email: string, code: string) {
    await this.userService.changeEmail(email, code);
    return true;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    await this.userService.resetPassword(resetPasswordDto);
    return true;
  }

  async handleGoogleCode(code: string) {
    const data = this.jwtService.decode(code, {});
    if (data === null) throw new BadRequestException('Something wrong');
    const email = data['email'];
    if (!(await this.userService.isEmailAvaliable(email))) {
      return this.userService.findFullInfoByEmail(email);
    } else {
      return await this.userService.registerWithGoogle(email);
    }
  }
}
