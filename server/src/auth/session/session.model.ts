import { prop } from '@typegoose/typegoose';

export class Session {
  @prop({ required: true })
  _id: string;

  @prop({ required: true })
  expires: Date;

  @prop({ required: true })
  session: string;
}
