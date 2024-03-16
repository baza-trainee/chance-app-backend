import { InjectModel } from '@m8a/nestjs-typegoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Medicine } from './model/medicine.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Injectable()
export class MedicineService {
  constructor(
    @InjectModel(Medicine)
    private readonly medicineModel: ReturnModelType<typeof Medicine>,
  ) {}

  async createMedicine(userId: string, dto: CreateMedicineDto) {
    const medicine = await this.medicineModel.create({ ...dto, userId });
    return medicine;
  }

  async getMedicine(userId: string) {
    const medicine = await this.medicineModel.find({ userId });
    return medicine;
  }

  async getMedicineById(id: string) {
    const medicine = await this.medicineModel.findById(id);

    if (!medicine)
      throw new HttpException(
        'Нагадування про ліки не знайдено',
        HttpStatus.NOT_FOUND,
      );
    return medicine;
  }

  async update(userId, id: string, data: UpdateMedicineDto) {
    const medicine = await this.getMedicineById(id);
    if (medicine.userId !== userId)
      throw new HttpException('Доступ заборонено', HttpStatus.FORBIDDEN);

    return await this.medicineModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(userId: string, id: string) {
    const medicine = await this.getMedicineById(id);
    if (medicine.userId !== userId)
      throw new HttpException('Доступ заборонено', HttpStatus.FORBIDDEN);
    return await medicine.deleteOne();
  }
}
