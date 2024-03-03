import { prop } from '@typegoose/typegoose';

class Contact {
  @prop()
  name: string;

  @prop()
  phone: string;
}

export class SosContact {
  @prop({ type: () => [Contact] })
  contacts: Contact[];

  @prop()
  userId: string;
  @prop({ required: false })
  group?: string;
}
