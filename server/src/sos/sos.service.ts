import { InjectModel } from '@m8a/nestjs-typegoose';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SosContact } from './models/sos.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { SosGroup } from './models/sos-group.model';
import { CreateContactDto } from './dto/create-contact.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class SosService {
  constructor(
    @InjectModel(SosContact)
    private readonly sosContactModel: ReturnModelType<typeof SosContact>,
    @InjectModel(SosGroup)
    private readonly sosGroupModel: ReturnModelType<typeof SosGroup>,
  ) {}
  async getMyContacts(userId: string) {
    const contacts = await this.sosContactModel.find({ userId });
    const groups = await this.sosGroupModel.find({ userId });
    return { groups, contacts };
  }
  async findContactById(id: string) {
    const contact = await this.sosContactModel.findById(id);
    if (contact === null) throw new NotFoundException('Контакт не знайдений');
    return contact;
  }
  async findGroupById(id: string) {
    const group = await this.sosGroupModel.findById(id);
    if (group === null) throw new NotFoundException('Группу не знайдено');
    return group;
  }
  async createContact(userId: string, createContactDto: CreateContactDto) {
    return await this.sosContactModel.create({ userId, ...createContactDto });
  }
  async deleteContact(id: string, userId: string) {
    const contact = await this.findContactById(id);
    if (contact.userId !== userId)
      throw new ForbiddenException('Доступ заборонено');
    await contact.deleteOne();
  }
  async createGroup(userId: string, createGroupDto: CreateGroupDto) {
    return await this.sosGroupModel.create({ userId, ...createGroupDto });
  }
  async deleteGroup(id: string, userId: string) {
    const group = await this.findGroupById(id);
    if (group.userId !== userId)
      throw new ForbiddenException('Доступ заборонено');
    await this.sosContactModel.deleteMany({ group: group.id });
    await group.deleteOne();
  }
  async updateContact(
    id: string,
    userId: string,
    updateContactDto: UpdateContactDto,
  ) {
    const contact = await this.findContactById(id);
    if (contact.userId !== userId)
      throw new ForbiddenException('Доступ заборонено');
    if (updateContactDto.group) {
      const group = await this.findGroupById(updateContactDto.group);
      if (group.userId !== userId)
        throw new ForbiddenException('Доступ до группи заборонено');
    }
    contact.updateOne(updateContactDto);
  }
  async updateGroup(
    id: string,
    userId: string,
    updateGroupDto: UpdateGroupDto,
  ) {
    const group = await this.findGroupById(id);
    if (group.userId !== userId)
      throw new ForbiddenException('Доступ заборонено');
    await group.updateOne(updateGroupDto);
  }
  async cleanUpAfterDelete(userId: string) {
    await this.sosGroupModel.deleteMany({ userId });
    await this.sosContactModel.deleteMany({ userId });
  }
}
