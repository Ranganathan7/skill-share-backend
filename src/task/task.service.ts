import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { AccountEntity } from '../entities/account.entity';
import { AccountRoles, TaskStatus } from '../common/constants/constants';
import { UpdateTaskProgressDto } from './dto/update-progress.dto';
import { UpdateTaskStatusDto } from './dto/update-status.dto';

@Injectable()
export class TaskService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Creates a new task and associates it with a user.
   * Validates that start date is not in the past.
   * Only users (not providers) are allowed to create tasks.
   */
  async createTask(completeDto: CreateTaskDto) {
    const { accountId, ...dto } = completeDto;

    if (
      new Date(dto.expectedStartDate) <
      new Date(new Date().setHours(0, 0, 0, 0))
    ) {
      throw new BadRequestException({
        errorCode: 'InvalidStartDate',
        description: 'expectedStartDate must be today or a future date',
      });
    }

    const account = await this.dataSource.manager.findOne(AccountEntity, {
      where: { id: accountId },
    });

    if (!account) {
      throw new HttpException(
        { errorCode: 'AccountNotFound', description: 'Invalid account ID' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (account.role !== AccountRoles.USER) {
      throw new HttpException(
        {
          errorCode: 'NotAUser',
          description: 'Only users can create tasks',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const task = {
      ...dto,
      status: TaskStatus.PENDING,
      user: account,
      progress: [],
    };

    await this.dataSource.manager.save(TaskEntity, task);
    return {
      message: 'Task created successfully!',
    };
  }

  /**
   * Returns all tasks created by or assigned to a given account.
   * Throws an error if no tasks are found.
   */
  async findTasksByAccount(accountId: number): Promise<TaskEntity[]> {
    const tasks = await this.dataSource.manager.find(TaskEntity, {
      where: [{ user: { id: accountId } }, { provider: { id: accountId } }],
      relations: ['user', 'provider', 'provider.skills'],
    });

    if (tasks.length === 0) {
      throw new NotFoundException({
        errorCode: 'NoTasksFound',
        description:
          'Invalid account id / No tasks found for provided account id',
      });
    }

    return tasks;
  }

  /**
   * Allows a provider to log progress on a task.
   * Validates task ownership and ensures task is not already completed.
   * Appends progress entry to the task.
   */
  async updateProgress(dto: UpdateTaskProgressDto) {
    const { taskId, description, accountId } = dto;

    const task = await this.dataSource.manager.findOne(TaskEntity, {
      where: { id: taskId },
      relations: ['provider'],
    });

    if (!task) {
      throw new HttpException(
        {
          errorCode: 'TaskNotFound',
          description: 'Task not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!task.provider || task.provider.id !== accountId) {
      throw new HttpException(
        {
          errorCode: 'InvalidTaskProgressUpdate',
          description:
            'Task is not assigned to a provider / invalid account id',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (task.status === TaskStatus.COMPLETED) {
      throw new HttpException(
        {
          errorCode: 'TaskAlreadyCompleted',
          description: 'Task is already completed!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    task.progress.push({
      description,
      timestamp: new Date(),
    });
    await this.dataSource.manager.save(TaskEntity, task);

    return {
      message: 'Task progress updated successfully!',
    };
  }

  /**
   * Allows the user who created the task to mark it as completed.
   * Validates user ownership, ensures task has been started and is not already completed.
   */
  async updateStatus(dto: UpdateTaskStatusDto) {
    const { taskId, accountId } = dto;

    const task = await this.dataSource.manager.findOne(TaskEntity, {
      where: { id: taskId },
      relations: ['user'],
    });

    if (!task) {
      throw new HttpException(
        {
          errorCode: 'TaskNotFound',
          description: 'Task not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (task.user.id !== accountId) {
      throw new HttpException(
        {
          errorCode: 'InvalidTaskStatusUpdate',
          description: 'Task is not created by given user',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (task.status === TaskStatus.COMPLETED) {
      throw new HttpException(
        {
          errorCode: 'TaskAlreadyCompleted',
          description: 'Task is already completed!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (task.status === TaskStatus.PENDING) {
      throw new HttpException(
        {
          errorCode: 'TaskNeverStarted',
          description: 'Task is never started by any provider!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    task.status = TaskStatus.COMPLETED;
    await this.dataSource.manager.save(TaskEntity, task);

    return {
      message: 'Task status updated successfully!',
    };
  }
}
