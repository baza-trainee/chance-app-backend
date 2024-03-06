import { modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { versionKey: false, timestamps: true } })
export class Message {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  message!: string;

  @prop({ required: true })
  fromUserId!: string;

  @prop({ required: true })
  toUserId!: string;
}
