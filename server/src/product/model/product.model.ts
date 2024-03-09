import { Ref, modelOptions, prop } from '@typegoose/typegoose';
import { User } from 'src/user/models/user.model';

@modelOptions({ schemaOptions: { versionKey: false, timestamps: true } })
export class Product {
  @prop()
  title: string;

  @prop({ ref: () => User })
  id: Ref<User>;

  @prop()
  description: string;

  @prop()
  price: string;

  @prop({ default: null })
  validity?: Date | null;
}
