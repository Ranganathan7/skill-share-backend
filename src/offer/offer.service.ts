import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AccountRoles } from 'src/common/constants/constants';
import { AccountEntity } from 'src/entities/account.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class OfferService {
  constructor(private readonly dataSource: DataSource) { }

  async makeOffer(accountId: number, taskId: number): Promise<TaskEntity> {
    const task = await this.dataSource.manager.findOne(TaskEntity, {
      where: { id: taskId },
      relations: ['offers'],
    });

    if (!task) {
      throw new HttpException(
        { errorCode: 'TaskNotFound', description: 'Task not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const account = await this.dataSource.manager.findOne(AccountEntity, {
      where: { id: accountId },
    });

    if (!account) {
      throw new HttpException(
        { errorCode: 'AccountNotFound', description: 'Account not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (account.role !== AccountRoles.PROVIDER) {
      throw new HttpException(
        { errorCode: 'UnauthorizedRole', description: 'Only providers can make offers' },
        HttpStatus.FORBIDDEN,
      );
    }

    task.offers = task.offers ?? []
    const alreadyOffered = task.offers.some((o) => o.id === accountId);
    if (alreadyOffered) {
      throw new HttpException(
        { errorCode: 'AlreadyOffered', description: 'You have already made an offer for this task' },
        HttpStatus.BAD_REQUEST,
      );
    }

    task.offers.push(account);
    return this.dataSource.manager.save(TaskEntity, task);
  }

  async getOffersForAccount(accountId: number) {
    const account = await this.dataSource.manager.findOne(AccountEntity, {
      where: { id: accountId },
      relations: ['tasksOffered', 'tasksOffered.user', 'tasksPosted', 'tasksPosted.offers'],
    });

    if (!account) {
      throw new HttpException({
        errorCode: 'AccountNotFound',
        description: 'No account found with the given ID',
      }, HttpStatus.NOT_FOUND);
    }

    const isProvider = account.role === AccountRoles.PROVIDER;

    if (isProvider) {
      const offeredTasks = account.tasksOffered?.map(task => ({
        taskId: task.id,
        taskName: task.name,
        user: {
          id: task.user?.id,
          email: task.user?.email,
          individualAccount: task.user?.individualAccount,
          companyAccount: task.user?.companyAccount,
        },
      }));

      return offeredTasks;
    }

    else {
      const postedTasks = account.tasksPosted?.map(task => ({
        taskId: task.id,
        taskName: task.name,
        offers: (task.offers || []).map(provider => ({
          id: provider.id,
          email: provider.email,
          individualAccount: provider.individualAccount,
          companyAccount: provider.companyAccount,
        })),
      }));

      return postedTasks;
    }
  }
} 
