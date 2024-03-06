import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {

  @IsNotEmpty()
  @IsString()
  message: string;
  @IsNotEmpty()
  @IsString()
  fromUserId: string;
  @IsNotEmpty()
  @IsString()
  toUserId: string;
}
