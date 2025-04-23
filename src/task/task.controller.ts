import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
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

  @Get('/get/:accountId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    type: Number,
    name: 'accountId'
  })
  @ApiOperation(swaggerAPIOptions.createTask)
  async findTaskByAccount(@Param('accountId', ParseIntPipe) accountId: number) {
    return this.taskService.findTasksByAccount(accountId)
  }
}
