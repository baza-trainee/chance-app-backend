import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyCustom } from '../../shared/decorators/isNotEmptyCustom';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';
import { LengthCustom } from '../../shared/decorators/LengthCustom';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @ApiProperty()
  @LengthCustom(2, 300)
  @IsNotEmptyCustom()
  @IsStringCustom()
  message: string;
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
