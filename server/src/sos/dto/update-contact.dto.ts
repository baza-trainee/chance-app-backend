import { ApiProperty } from '@nestjs/swagger';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';
import { LengthCustom } from '../../shared/decorators/LengthCustom';
import { IsPhoneCustom } from '../../shared/decorators/isPhoneCustom';
import { IsOptional } from 'class-validator';

export class UpdateContactDto {
  @ApiProperty()
  @IsStringCustom()
  @LengthCustom(2, 30)
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsStringCustom()
  @IsPhoneCustom()
  @IsOptional()
  phone: string;
  @ApiProperty()
  @IsStringCustom()
  group: string;
}
