import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { MedicineInstruction, MedicineType, Periodicity } from '../enums/enums';

export class CreateMedicineDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: MedicineType })
  @IsNotEmpty()
  @IsEnum(MedicineType)
  type: MedicineType;

  @ApiProperty({ enum: Periodicity })
  @IsNotEmpty()
  @IsEnum(Periodicity)
  periodicity: Periodicity;

  @ApiProperty()
  @IsNotEmpty()
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
}
