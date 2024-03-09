import { InjectModel } from '@m8a/nestjs-typegoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Navaccess } from './model/navaccess.model';
import { CreateNavvaccessDto } from './dto/create-navacces.dto';
import { AcceptStatus } from './enum/navaccess.enum';

@Injectable()
export class NavaccessService {
  constructor(@InjectModel(Navaccess) private readonly navaccessModel) {}

  async create(dto: CreateNavvaccessDto, userId: string) {
    const navaccess = await this.navaccessModel.create({
      ...dto,
      fromUserId: userId,
    });
    return navaccess;
  }

  async getMyAccess(userId: string) {
    return await this.navaccessModel.find({
      toUserId: { $elemMatch: { id: userId } },
    });
  }

  async getAccesFromMe(userId: string) {
    return await this.navaccessModel.find({ fromUserId: userId });
  }

  async acceptInvitation(navaccessId: string, userId: string) {
    return await this.navaccessModel.findOneAndUpdate(
      { _id: navaccessId, 'toUserId.id': userId },
      { $set: { 'toUserId.$.acceptStatus': AcceptStatus.Accepted } },
      { new: true },
    );
  }

  async rejectInvitation(navaccessId: string, userId: string) {
    return await this.navaccessModel.findOneAndUpdate(
      { _id: navaccessId, 'toUserId.id': userId },
      { $set: { 'toUserId.$.acceptStatus': AcceptStatus.Rejected } },
      { new: true },
    );
  }

  async getAccesByid(navaccessId: string, userId: string) {
    const acces = await this.navaccessModel.findOne({
      _id: navaccessId,
      fromUserId: userId,
    });

    if (!acces) {
      throw new NotFoundException('Access not found');
    }

    return acces;
  }

  async deleteNavAccesById(navaccessId: string, userId: string) {
    const acces = await this.getAccesByid(navaccessId, userId);
    await acces.deleteOne();
    return { message: 'Access deleted' };
  }
}
