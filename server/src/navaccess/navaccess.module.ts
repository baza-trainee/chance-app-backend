import { Module } from '@nestjs/common';
import { NavaccessController } from './navaccess.controller';
import { NavaccessService } from './navaccess.service';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Navaccess } from './model/navaccess.model';

@Module({
  imports: [TypegooseModule.forFeature([Navaccess])],
  controllers: [NavaccessController],
  providers: [NavaccessService],
})
export class NavaccessModule {}
