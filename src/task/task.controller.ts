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
import { createTask, updateTaskProgress, updateTaskStatus } from './dto/sample-requests';
import { UpdateTaskProgressDto } from './dto/update-progress.dto';
import { UpdateTaskStatusDto } from './dto/update-status.dto';

@ApiTags('Task related services')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  /**
   * Endpoint to create a new task.
   * Accepts task details and associates it with the user account.
   * Returns the created task on success.
   */
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

  /**
   * Endpoint to fetch all tasks related to an account.
   * Returns tasks posted by or assigned to the account.
   */
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

  /**
   * Endpoint for provider to update progress of an ongoing task.
   * Accepts task ID and new progress value.
   * Returns updated task status on success.
   */
  @Post('update-progress')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: UpdateTaskProgressDto,
    examples: {
      updateTaskProgress: {
        value: updateTaskProgress
      },
    }
  })
  @ApiOperation(swaggerAPIOptions.updateTaskProgress)
  async updateProgress(@Body() dto: UpdateTaskProgressDto) {
    return this.taskService.updateProgress(dto);
  }

  /**
   * Endpoint for user to update the final status of a task.
   * Typically used to mark the task as completed.
   */
  @Post('update-status')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: UpdateTaskStatusDto,
    examples: {
      updateTaskStatus: {
        value: updateTaskStatus
      },
    }
  })
  @ApiOperation(swaggerAPIOptions.updateTaskStatus)
  async updateStatus(@Body() dto: UpdateTaskStatusDto) {
    return this.taskService.updateStatus(dto);
  }
}
