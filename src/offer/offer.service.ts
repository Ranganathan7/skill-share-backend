import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AccountRoles, TaskStatus } from 'src/common/constants/constants';
import { AccountEntity } from 'src/entities/account.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { DataSource } from 'typeorm';
import { AcceptOfferDto } from './dto/accept-offer.dto';

@Injectable()
export class OfferService {
  constructor(private readonly dataSource: DataSource) { }

  /**
   * Method to make an offer for a task.
   * - Validates if task exists and if an offer has already been accepted.
   * - Checks if the account is a provider and has not already made an offer for this task.
   * Returns updated task with the new offer added.
   */
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

    if (task.provider) {
      throw new HttpException(
        {
          errorCode: 'OfferAlreadyAccepted',
          description: 'An offer has already been accepted for this task',
        },
        HttpStatus.BAD_REQUEST,
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

  /**
   * Method to retrieve all offers for a given account.
   * - If provider: returns tasks they offered for, excluding tasks with accepted offers.
   * - If user: returns their posted tasks with pending offers.
   * Returns tasks with relevant offer details based on the account's role.
   */
  async getOffersForAccount(accountId: number) {
    const account = await this.dataSource.manager.findOne(AccountEntity, {
      where: { id: accountId },
      relations: ['tasksOffered', 'tasksOffered.user', 'tasksOffered.provider', 'tasksPosted', 'tasksPosted.offers', 'tasksPosted.provider', 'tasksPosted.offers.skills'],
    });

    if (!account) {
      throw new HttpException({
        errorCode: 'AccountNotFound',
        description: 'No account found with the given ID',
      }, HttpStatus.NOT_FOUND);
    }

    const isProvider = account.role === AccountRoles.PROVIDER;

    if (isProvider) {
      const offeredTasks = (account.tasksOffered || [])
        .filter(task => !task.provider) // exclude accepted
        .map(task => ({
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
    } else {
      const postedTasks = (account.tasksPosted || [])
        .filter(task => !task.provider) // exclude accepted
        .map(task => ({
          taskId: task.id,
          taskName: task.name,
          offers: (task.offers || []).map(provider => ({
            id: provider.id,
            email: provider.email,
            individualAccount: provider.individualAccount,
            companyAccount: provider.companyAccount,
            skills: provider.skills,
          })),
        }));

      return postedTasks;
    }
  }

  /**
   * Method to accept an offer for a task.
   * - Verifies if the task exists, if the user has the correct permissions (task creator), and if the task is not already assigned.
   * - Validates if the provider exists in the offers list before assigning the offer and changing task status.
   * Returns success message if offer is accepted successfully.
   */
  async acceptOffer(dto: AcceptOfferDto) {
    const { accountId: userId, providerId, taskId } = dto;

    const task = await this.dataSource.manager.findOne(TaskEntity, {
      where: { id: taskId },
      relations: ['user', 'provider', 'offers'],
    });

    if (!task) {
      throw new HttpException(
        { errorCode: 'TaskNotFound', description: 'Task not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (task.user.id !== userId) {
      throw new HttpException(
        { errorCode: 'Unauthorized', description: 'Only the user who created the task can accept offers' },
        HttpStatus.FORBIDDEN,
      );
    }

    if (task.provider) {
      throw new HttpException(
        { errorCode: 'AlreadyAccepted', description: 'This task already has a provider assigned' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const provider = (task.offers ?? [])?.filter(offer => offer.id === providerId)[0]
    if (!provider) {
      throw new HttpException(
        { errorCode: 'OfferNotFound', description: 'The provider has not made an offer for this task' },
        HttpStatus.BAD_REQUEST,
      );
    }

    task.provider = provider;
    task.status = TaskStatus.IN_PROGRESS;

    await this.dataSource.manager.save(task);
    return {
      message: 'Offer accepted successfully!'
    }
  }
}

