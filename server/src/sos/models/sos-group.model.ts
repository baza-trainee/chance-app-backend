import { prop } from '@typegoose/typegoose';

export class SosGroup {
  @prop()
  name: string;
  @prop()
  userId: string;
}
