import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';

class ToUserDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}

export class CreateNavvaccessDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  toUserId: ToUserDto[];
}
