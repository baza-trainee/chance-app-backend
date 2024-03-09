import { prop, modelOptions } from '@typegoose/typegoose';
import { MedicineInstruction, MedicineType, Periodicity } from '../enums/enums';

@modelOptions({ schemaOptions: { versionKey: false, timestamps: true } })
export class Medicine {
  @prop({ required: true })
  id!: number;

  @prop({ required: true })
  reminderIds!: number[];

  @prop({ required: true })
  name!: string;

  @prop({ required: true, enum: MedicineType })
  type!: MedicineType;

  @prop({ required: true, enum: Periodicity })
  periodicity!: Periodicity;

  @prop({ required: true })
  startDate!: Date;

  @prop({ required: false })
  weekdays?: number[];

  @prop({ required: false })
  doses?: Record<number, number>;

  @prop({ required: false })
  instruction?: MedicineInstruction;

  @prop({ required: false })
  userId?: string;
}
