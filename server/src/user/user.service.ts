import { InjectModel } from '@m8a/nestjs-typegoose';
import { User } from './models/user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import {
  BadRequestException,
  Inject,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { UpdateuserDto } from './dto/update-user.dto';
import { ConfirmEmailDto } from '../auth/dto/confirm-email.dto';
import { ResetPasswordDto } from '../mail/dto/reset-password.dto';
import { ResendCodeDto } from '../auth/dto/resend-code.dto';
import { TaskService } from '../task/task.service';
import {
  accountNotFound,
  emailNotFound,
  expiredCode,
  notFound,
  wrongCode,
} from './utils/errors';

export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
    @Inject(forwardRef(() => TaskService))
    private taskService: TaskService,
  ) {}

  async findByEmail(email: string) {
    const findedDoc = await this.userModel.findOne({ email });
    if (findedDoc === null) throw new NotFoundException(emailNotFound);
    return findedDoc;
  }

  async findByNickName(nick: string) {
    const findedDoc = await this.userModel.findOne({ name: nick });
    if (findedDoc === null) throw new NotFoundException(accountNotFound);
    return findedDoc;
  }

  async isEmailAvaliable(email: string) {
    const findedDoc = await this.userModel.findOne({ email });
    return !Boolean(findedDoc);
  }

  async findById(id: string) {
    const findedDoc = await this.userModel.findById(id);
    if (findedDoc === null) throw new NotFoundException(notFound);
    return findedDoc;
  }
  /* 
  async findMany(ids: string[]) {
    const users = await this.userModel.find().where('_id').in(ids).exec();
    const responseIds = users.map((item) => item._id.toString());

    for (const id of ids) {
      if (!responseIds.includes(id)) {
        throw new NotFoundException(`User ID ${id} not found`);
      }
    }
    return users;
  } */

  async findFullInfoByEmail(email: string) {
    const findedDoc = await this.userModel
      .findOne({ email })
      .populate([
        'password',
        'activationCode',
        'passwordResetCode',
        'passwordResetCodeExpire',
        'newEmail',
        'changeEmailCode',
        'changeEmailCodeExpire',
      ]);
    if (findedDoc === null) throw new NotFoundException(emailNotFound);
    return findedDoc;
  }

  async sendConfirmationEmail(resendCodeDto: ResendCodeDto) {
    const activationCode = String(this.generateFourDigitCode());
    const user = await this.findFullInfoByEmail(resendCodeDto.email);
    user.activationCode = activationCode;
    await this.mailService.sendConfirmationEmail({
      code: activationCode,
      email: resendCodeDto.email,
    });
    await user.save();
  }

  async createuser(createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    await this.userModel.create({
      password: hash,
      email: createUserDto.email,
      isConfirmed: false,
      phone: createUserDto.phone,
      name: createUserDto.name,
      lastName: createUserDto.lastName,
    });
    await this.sendConfirmationEmail({ email: createUserDto.email });
    return true;
  }

  async confirmAccountByCode(confirmEmailDto: ConfirmEmailDto) {
    const user = await this.findFullInfoByEmail(confirmEmailDto.email);
    if (user.activationCode !== confirmEmailDto.code) {
      throw new BadRequestException('Wrong code');
    }
    user.isConfirmed = true;
    user.activationCode = '';
    await user.save();
    return true;
  }

  async sendPasswordCode(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    const code = String(this.generateFourDigitCode());
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    await this.mailService.sendPasswordResetCode({ code, email });
    user.passwordResetCode = code;
    user.passwordResetCodeExpire = date;
    await user.save();
    return;
  }

  async sendChangeEmailCode(userId: string, email: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (!user.isConfirmed)
      throw new BadRequestException('Account not confirmed');
    const code = String(this.generateFourDigitCode());
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    await this.mailService.sendChangeEmailCode(email, code);
    user.newEmail = email;
    user.changeEmailCode = code;
    user.changeEmailCodeExpire = date;
    await user.save();
    return;
  }

  async changeEmail(email: string, code: string) {
    const user = await this.findFullInfoByEmail(email);
    if (Date.now() > user.changeEmailCodeExpire.getTime()) {
      throw new BadRequestException(expiredCode);
    }
    if (user.changeEmailCode !== code) throw new BadRequestException(wrongCode);
    const oldEmail = user.email;
    const newEmail = user.newEmail;
    user.email = user.newEmail;
    user.changeEmailCode = '';
    user.newEmail = '';
    await user.save();
    await this.mailService.sendEmailChanged(newEmail, oldEmail);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.findFullInfoByEmail(resetPasswordDto.email);
    if (Date.now() > user.passwordResetCodeExpire.getTime()) {
      throw new BadRequestException(expiredCode);
    }
    if (user.passwordResetCode !== resetPasswordDto.code)
      throw new BadRequestException(wrongCode);
    const hash = await bcrypt.hash(resetPasswordDto.password, 10);
    user.password = hash;
    user.passwordResetCode = '';
    await user.save();
  }

  async updateuser(patchuserDto: UpdateuserDto, email: string) {
    const user = await this.findByEmail(email);
    /*    if (
      patchuserDto.avatar &&
      user.avatar &&
      patchuserDto.avatar !== user.avatar
    ) {
      await this.backblazeService.deleteFile(user.avatar);
    } */
    await user.updateOne(patchuserDto);
    return await this.findByEmail(email);
  }

  async deleteUserDEV(email: string) {
    console.log(email);
    const parent = await this.findByEmail(email);
    await this.taskService.deleteAllTasks(parent.id);
    await parent.deleteOne();
    return true;
  }

  async registerWithGoogle(email: string) {
    const user = await this.userModel.create({
      password: 'google',
      email: email,
      isConfirmed: true,
      sendingEmails: true,
    });
    return user;
  }

  private generateFourDigitCode() {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    return randomNumber;
  }
  /* 
  async deletePhoto(userId: string) {
    const user = await this.findById(userId);
    if (user.avatar) {
      await this.backblazeService.deleteFile(user.avatar);
      user.avatar = '';
      await user.save();
      return true;
    }
    return null;
  }
 */

  /*   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async deleteInactiveAccounts() {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    const inactiveAccounts = await this.userModel.find({
      lastLoginDate: { $lte: date },
    });
    if (inactiveAccounts.length) {
      console.log('deleted accounts');
      console.log(inactiveAccounts);
      await Promise.all(
        inactiveAccounts.map((acc) => this.deleteAccount(acc.email)),
      );
    }
  } */
}
