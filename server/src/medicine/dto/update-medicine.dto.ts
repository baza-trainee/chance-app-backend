import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { MedicineInstruction, MedicineType, Periodicity } from '../enums/enums';

export class UpdateMedicineDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ enum: MedicineType })
  @IsOptional()
  @IsEnum(MedicineType)
  type: MedicineType;

  @ApiProperty({ enum: Periodicity })
  @IsOptional()
  @IsEnum(Periodicity)
  periodicity: Periodicity;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  weekdays: number[];

  @ApiProperty()
  @IsOptional()
  @IsObject()
  doses: Record<number, number>;

  @ApiProperty({ enum: MedicineInstruction })
  @IsOptional()
  @IsEnum(MedicineInstruction)
  instruction?: MedicineInstruction;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  doneAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  rescheduledOn?: Record<string, number>;
}
