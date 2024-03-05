import { ApiProperty } from '@nestjs/swagger';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';
import { LengthCustom } from '../../shared/decorators/LengthCustom';
import { IsPhoneCustom } from '../../shared/decorators/isPhoneCustom';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ContactDto {
  @ApiProperty()
  @IsStringCustom()
  @LengthCustom(2, 30)
  name: string;

  @ApiProperty()
  @IsStringCustom()
  @IsPhoneCustom()
  phone: string;
}

export class CreateContactDto {

  @ApiProperty()
  @IsString()
  @IsOptional()
  group: string;
  @ApiProperty({ type: [ContactDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts: ContactDto[];
}
