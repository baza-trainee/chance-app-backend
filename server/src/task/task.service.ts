import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { Task } from './model/task.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '../user/user.service';
import { QueueService } from '../queue/queue.service';

@Injectable({})
export class TaskService {
  constructor(
    @InjectModel(Task)
    private readonly taskModel: ReturnModelType<typeof Task>,
    private readonly queueService: QueueService,
  ) {}

  async getUserTasks(userId: string) {
    return await this.taskModel.find({ userId });
  }

  async getTaskById(id: string) {
    const task = await this.taskModel.findById(id);
    if (task === null) throw new NotFoundException('Задача не знайдена');
    return task;
  }

  async addTask(userId: string, createTaskDto: CreateTaskDto) {
    await this.taskModel.create({ userId, ...createTaskDto, isSended: false });
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await this.getTaskById(taskId);
    if (task.userId !== userId) throw new ForbiddenException();
    return await task.deleteOne();
  }

  async getIncomingTasks() {
    return await this.taskModel.find({
      $and: [
        { date: { $lte: Date.now() + 10_000 } },
        { isSended: false },
        { isDone: false },
      ],
    });
  }

  async deleteAllTasks(userId: string) {
    await this.taskModel.deleteMany({ userId });
  }

  async updateTask(updateTaskDto: UpdateTaskDto, id: string, userId: string) {
    const task = await this.getTaskById(id);
    if (task.userId !== userId) throw new ForbiddenException();
    await task.updateOne(updateTaskDto);
    return await this.getTaskById(id);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async getTasks() {
    const tasks = await this.getIncomingTasks();
    tasks.forEach((task) =>
      this.queueService.addTask({
        message: task.message,
        task_id: task.id,
        task_type: 'task',
        user_id: task.userId,
      }),
    );
  }
}
