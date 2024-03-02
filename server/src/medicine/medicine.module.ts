import { Module } from '@nestjs/common';
import { MedicineController } from './medicine.controller';
import { MedicineService } from './medicine.service';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Medicine } from './model/medicine.model';

@Module({
  imports: [TypegooseModule.forFeature([Medicine])],
  controllers: [MedicineController],
  providers: [MedicineService],
})
export class MedicineModule {}
