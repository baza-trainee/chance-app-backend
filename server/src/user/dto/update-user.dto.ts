import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { MatchesCustom } from '../../shared/decorators/matchesCustom';
import { IsNotEmptyCustom } from '../../shared/decorators/isNotEmptyCustom';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';
import { LengthCustom } from '../../shared/decorators/LengthCustom';
import { IsPhoneCustom } from 'src/shared/decorators/isPhoneCustom';

export class UpdateuserDto {
  @ApiProperty()
  @IsStringCustom()
  @MatchesCustom(/^[a-zA-Zа-яА-ЯґҐєЄіІїЇўЎ\s\-’]+$/gim)
  @IsNotEmptyCustom()
  @LengthCustom(2, 18)
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsStringCustom()
  @MatchesCustom(/^[a-zA-Zа-яА-ЯґҐєЄіІїЇўЎ\s\-’]+$/gim)
  @IsNotEmptyCustom()
  @LengthCustom(2, 18)
  @IsOptional()
  lastName: string;
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  @LengthCustom(13, 13)
  @IsPhoneCustom()
  @IsOptional()
  phone: string;
}
