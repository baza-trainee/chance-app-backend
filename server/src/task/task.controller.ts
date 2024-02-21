import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Patch
} from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CookieAuthenticationGuard } from 'src/auth/guards/coockie.guard';
import RequestWithSession from 'src/auth/interfaces/req-with-session.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('task')
@Controller('task')
@ApiCookieAuth()
@UseGuards(CookieAuthenticationGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Get()
  async getMyTasks(@Req() request: RequestWithSession) {
    return await this.taskService.getUserTasks(request.user.id);
  }
  @Delete('/:id')
  async deleteTask(
    @Req() request: RequestWithSession,
    @Param('id') id: string,
  ) {
    return await this.taskService.deleteTask(request.user.id, id);
  }
  @Post()
  async addTask(
    @Req() requrest: RequestWithSession,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return await this.taskService.addTask(requrest.user.id,createTaskDto)
  }
  @Patch('/:taskId')
  async updateTask(
    @Req() requrest: RequestWithSession,
    @Body() updateTaskDto: UpdateTaskDto,
    @Param('taskId') taskId:string
  ) {
    return await this.taskService.updateTask(updateTaskDto,taskId,requrest.user.id)
  }
}
