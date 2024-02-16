import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/models/user.model';
import { DocumentType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor() {
    super();
  }

  serializeUser(user: DocumentType<User>, done: CallableFunction) {
    done(null, { id: user.id, email: user.email });
  }

  async deserializeUser({ id, email }, done: CallableFunction) {
    done(null, { id, email });
  }
}
