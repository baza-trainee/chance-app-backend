import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import fastq, { queueAsPromised } from 'fastq';
import { FirebaseService } from '../firebase/firebase.service';
import { UserService } from '../user/user.service';
import { QueueTask } from './interfaces/queue-task.type';
import { TaskService } from '../task/task.service';

@Injectable()
export class QueueService {
  queue: queueAsPromised<QueueTask>;
  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly logger: Logger,
    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,
  ) {
    console.log(this.userService);
    this.queue = fastq.promise(
      {
        userService: this.userService,
        logger: this.logger,
        firebaseService: this.firebaseService,
        taskService: this.taskService,
      },
      this._handler,
      1,
    );
  }

  async addTask(task: QueueTask) {
    await this.queue.push(task);
  }

  async _handler(arg: QueueTask) {
    try {
      const user = await this.userService.findById(arg.user_id);
      if (user.deviceId) {
        await this.firebaseService.sendPushNotific(
          user.deviceId,
          arg.task_type,
          { message: arg.message },
        );
        const task = await this.taskService.getTaskById(arg.task_id);
        task.isSended = true; // Move to taskService
        await task.save();
        this.logger.log(
          `task with id ${arg.task_id} from ${arg.task_type} sended`,
        );
      }
      this.logger.log(
        `task with id ${arg.task_id} from ${arg.task_type} device not found`,
      );
    } catch (error) {
      console.log(`error on task ${arg.task_id}`, error);
      this.logger.error(error);
    }
  }
}
