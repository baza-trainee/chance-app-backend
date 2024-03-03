import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CookieAuthenticationGuard } from 'src/auth/guards/coockie.guard';
import { MedicineService } from './medicine.service';
import RequestWithSession from 'src/auth/interfaces/req-with-session.interface';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@ApiTags('medicine')
@Controller('medicine')
@ApiCookieAuth()
@UseGuards(CookieAuthenticationGuard)
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Get()
  async getMedicine() {
    return this.medicineService.getMedicine();
  }

  @Get('/:id')
  async getMedicineById(@Param('id') id: string) {
    return this.medicineService.getMedicineById(id);
  }

  @Post()
  async addMedicine(
    @Req() request: RequestWithSession,
    @Body() createMedicineDto: CreateMedicineDto,
  ) {
    return await this.medicineService.createMedicine(
      request.user.id,
      createMedicineDto,
    );
  }

  @Patch('/:id')
  async updateMedicine(
    @Req() request: RequestWithSession,
    @Body() dto: UpdateMedicineDto,
    @Param('id') id: string,
  ) {
    return await this.medicineService.update(request.user.id, id, dto);
  }

  @Delete('/:id')
  async deleteMedicine(
    @Req() request: RequestWithSession,
    @Param('id') id: string,
  ) {
    return await this.medicineService.delete(request.user.id, id);
  }
}
