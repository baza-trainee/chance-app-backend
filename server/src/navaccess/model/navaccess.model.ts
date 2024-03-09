import { Ref, prop } from '@typegoose/typegoose';
import { User } from 'src/user/models/user.model';
import { AcceptStatus } from '../enum/navaccess.enum';

class ToUser {
  @prop({ ref: () => User, required: true })
  id: Ref<User>;

  @prop({ default: AcceptStatus.Pending })
  acceptStatus: AcceptStatus;
}

export class Navaccess {
  @prop({ ref: () => User })
  fromUserId: Ref<User>;

  @prop({ type: () => [ToUser], default: [] })
  toUserId: ToUser[];
}
