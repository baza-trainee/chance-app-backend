import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newMessage: string;
}
