import { prop } from '@typegoose/typegoose';

export class User {
  @prop({ required: true, unique: true })
  email!: string;

  @prop({ required: false, select: false })
  password?: string;

  @prop({ required: false })
  name: string;

  @prop({ required: false })
  lastName: string;

  @prop({ required: false })
  phone: string;

  @prop({ default: false })
  isGoogle: boolean;

  @prop({ required: false, select: false })
  activationCode?: string;

  @prop({ required: false, select: false })
  passwordResetCode?: string;

  @prop({ required: false, select: false })
  passwordResetCodeExpire?: Date;

  @prop({ required: false, select: false })
  newEmail?: string;

  @prop({ required: false, select: false })
  changeEmailCode?: string;

  @prop({ required: false, select: false })
  changeEmailCodeExpire?: Date;

  @prop({ required: false })
  isConfirmed: boolean;

  @prop({ requried: false })
  deviceId: string;

  
}
