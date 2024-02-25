import { ApiProperty } from '@nestjs/swagger';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';
import { LengthCustom } from '../../shared/decorators/LengthCustom';
import { IsPhoneCustom } from '../../shared/decorators/isPhoneCustom';
import { IsOptional } from 'class-validator';

export class CreateContactDto {
  @ApiProperty()
  @IsStringCustom()
  @LengthCustom(2, 30)
  name: string;
  @ApiProperty()
  @IsStringCustom()
  @IsPhoneCustom()
  phone: string;
  @ApiProperty()
  @IsStringCustom()
  @IsOptional()
  group: string;
}
