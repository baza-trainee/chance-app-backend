import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Module } from '@nestjs/common';
import { SosGroup } from './models/sos-group.model';
import { SosContact } from './models/sos.model';
import { SosService } from './sos.service';
import { SosController } from './sos.controller';

@Module({
  imports: [TypegooseModule.forFeature([SosGroup, SosContact])],
  controllers: [SosController],
  providers: [SosService],
  exports: [SosService],
})
export class SosModule {}
