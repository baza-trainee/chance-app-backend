import { InjectModel } from '@m8a/nestjs-typegoose';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as cookie from 'cookie';
import * as cookieParser from 'cookie-parser';
import { Session } from '../session/session.model';
import { Model } from 'mongoose';
@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    @InjectModel(Session) private readonly sessionModel: Model<Session>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const cookies = cookie.parse(client.handshake.headers.cookie);

    const sidCookie = cookies['connect.sid'];

    const sid = cookieParser.signedCookie(
      sidCookie,
      process.env.SESSION_SECRET,
    );

    if (!cookies) {
      throw new UnauthorizedException('No session id found in cookies');
    }

    const sessionData = await this.sessionModel.findById(sid);

    const sessionObject = JSON.parse(sessionData.session);

    const user = sessionObject.passport.user;


    context.switchToWs().getData().user = user;

    return true;
  }
}
