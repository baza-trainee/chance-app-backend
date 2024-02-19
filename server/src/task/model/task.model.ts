import { prop } from '@typegoose/typegoose';

export class Task {
  @prop({ required: true })
  userId!: string;

  @prop({ required: true })
  date!: Date;

  @prop({ required: true })
  message!: string;

  @prop({ required: false })
  isSended: boolean;
}
