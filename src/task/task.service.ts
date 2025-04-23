import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { AccountEntity } from '../entities/account.entity';
import { AccountRoles, TaskStatus } from 'src/common/constants/constants';

@Injectable()
export class TaskService {
  constructor(private readonly dataSource: DataSource) { }

  async createTask(completeDto: CreateTaskDto) {
    const { accountId, ...dto } = completeDto;
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
      message: 'Task created successfully!'
    }
  }
}
