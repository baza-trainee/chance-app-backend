import { prop } from '@typegoose/typegoose';

export class SosContact {
  @prop()
  name: string;
  @prop()
  phone: string;
  @prop()
  userId: string;
  @prop({ required: false })
  group?: string;
}
