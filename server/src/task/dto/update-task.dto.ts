import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyCustom } from '../../shared/decorators/isNotEmptyCustom';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';
import { IsDate, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTaskDto {
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  @IsOptional()
  message: string;
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date: Date;
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isDone: boolean;
}
