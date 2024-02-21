import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyCustom } from '../../shared/decorators/isNotEmptyCustom';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  message: string;
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsDate()
  @Type(() => Date)
  date: Date;
}
