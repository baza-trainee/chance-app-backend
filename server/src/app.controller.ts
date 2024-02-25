import { Controller, Get, StreamableFile  } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  ping() {
    return 'pong';
  }
  @Get('policy')
  getPolicy(): StreamableFile  {
    const file = createReadStream(join(process.cwd(),'src','static','policy.pdf'))
    return new StreamableFile(file)
  }
}
