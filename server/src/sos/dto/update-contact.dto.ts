import { ApiProperty } from '@nestjs/swagger';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';
import { LengthCustom } from '../../shared/decorators/LengthCustom';
import { IsPhoneCustom } from '../../shared/decorators/isPhoneCustom';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ContactDto {
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
}

export class UpdateContactDto {


  @ApiProperty()
  @IsStringCustom()
  @IsOptional()
  group: string;

  @ApiProperty({ type: [ContactDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  @IsOptional()
  contacts: ContactDto[];
}
