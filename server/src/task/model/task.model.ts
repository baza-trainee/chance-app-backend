import { prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export class Task extends TimeStamps {
  @prop({ required: true })
  userId!: string;

  @prop({ required: true })
  date!: Date;

  @prop({ required: true })
  message!: string;

  @prop({ required: false })
  isSended: boolean;

  @prop({ required: false, default: false })
  isDone: boolean;

  @prop({ required: false, default: 0 })
  remindBefore: number;
}
