import { IsNotEmptyEmailCustom } from '../../shared/decorators/isNotEmptyEmailCustom';
import { IsEmailCustom } from '../../shared/decorators/isEmailCustom';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';
import { PasswordDto } from './../../shared/dto/password.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneCustom } from '../../shared/decorators/isPhoneCustom';
import { LengthCustom } from '../../shared/decorators/LengthCustom';
import { MatchesCustom } from '../../shared/decorators/matchesCustom';

export class RegisterDto extends PasswordDto {
  @ApiProperty()
  @IsStringCustom()
  @IsEmailCustom()
  @IsNotEmptyEmailCustom()
  email: string;
  @ApiProperty()
  @MatchesCustom(/^[a-zA-Zа-яА-ЯґҐєЄіІїЇўЎ\s\-’'`]+$/)
  @LengthCustom(2, 30)
  @IsStringCustom()
  name: string;
  @ApiProperty()
  @LengthCustom(2, 50)
  @MatchesCustom(/^[a-zA-Zа-яА-ЯґҐєЄіІїЇўЎ\s\-’'`]+$/)
  @IsStringCustom()
  lastName: string;
  @ApiProperty()
  @IsPhoneCustom()
  @IsStringCustom()
  phone: string;
}
