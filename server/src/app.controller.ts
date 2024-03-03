import { Controller, Get, StreamableFile, Header} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  ping() {
    return 'pong';
  }
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=policy.pdf')
  @Get('policy')
  getPolicy(): StreamableFile  {
    const file = createReadStream(join(process.cwd(),'src','static','policy.pdf'))
    return new StreamableFile(file)
  }
}
