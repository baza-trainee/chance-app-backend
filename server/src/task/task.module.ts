import { Module, forwardRef } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Task } from './model/task.model';
import { UserModule } from '../user/user.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    TypegooseModule.forFeature([Task]),
    forwardRef(() => UserModule),
    QueueModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
