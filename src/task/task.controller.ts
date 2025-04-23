import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { swaggerAPIOptions } from 'src/common/swagger/operations';
import { createTask } from './dto/sample-requests';

@ApiTags('Task related services')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: CreateTaskDto,
    examples: {
      createTask: {
        value: createTask
      },
    }
  })
  @ApiOperation(swaggerAPIOptions.createTask)
  async createTask(@Body() dto: CreateTaskDto) {
    return this.taskService.createTask(dto);
  }
}
