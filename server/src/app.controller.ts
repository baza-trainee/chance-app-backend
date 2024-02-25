import { Controller, Get,Res } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  ping() {
    return 'pong';
  }
  @Get('policy')
  getPolicy(@Res() res: Response) {
    const file = createReadStream(join(process.cwd(),'src','static','policy.pdf'))
    file.pipe(res)
  }
}
