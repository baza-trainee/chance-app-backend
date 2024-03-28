import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ResetPasswordDto } from '../mail/dto/reset-password.dto';
import { UserService } from './../user/user.service';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import RequestWithSession from './interfaces/req-with-session.interface';
import {
  emailAlreadyTaken,
  notConfrimedAccount,
  wrongCredentials,
} from './utils/errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
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
  Ò;

  async login(loginDto: LoginDto, request: RequestWithSession) {
    const firebaseToken = await this.firebaseService.createCustomToken(
      request.user.id,
      {
        id: request.user.id,
        email: request.user.email,
      },
    );
    return {
      id: request.user.id,
      token: firebaseToken,
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
    return user;
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
