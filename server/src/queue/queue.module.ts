import { Logger, Module, forwardRef } from '@nestjs/common';
import { QueueService } from './queue.service';
import { UserModule } from '../user/user.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    FirebaseModule,
    forwardRef(() => TaskModule),
  ],
  providers: [QueueService, Logger],
  exports: [QueueService],
})
export class QueueModule {}
