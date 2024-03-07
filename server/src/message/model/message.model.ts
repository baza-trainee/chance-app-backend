import { Ref, modelOptions, prop } from '@typegoose/typegoose';
import { User } from 'src/user/models/user.model';

@modelOptions({ schemaOptions: { versionKey: false, timestamps: true } })
export class Message {
  @prop()
  message: string;

  @prop({ ref: () => User })
  fromUserId: Ref<User>;

  @prop({ ref: () => User })
  toUserId: Ref<User>;

  @prop()
  geoData?: {
    latitude: number;
    longitude: number;
  };
}
