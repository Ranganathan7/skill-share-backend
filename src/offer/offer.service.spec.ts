import { OfferService } from './offer.service';
import { DataSource } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { AccountRoles } from '../common/constants/constants';
import { HttpException } from '@nestjs/common';
import { AcceptOfferDto } from './dto/accept-offer.dto';

describe('OfferService', () => {
  let service: OfferService;
  let dataSource: DataSource;

  beforeEach(() => {
    dataSource = {
      manager: {
        findOne: jest.fn(),
        save: jest.fn(),
      },
    } as any;
    service = new OfferService(dataSource);
  });

  describe('makeOffer', () => {
    it('should throw if task not found', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.makeOffer(1, 1)).rejects.toThrow(HttpException);
    });

    it('should throw if task already has a provider', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce({
        provider: {},
      });

      await expect(service.makeOffer(1, 1)).rejects.toThrow(HttpException);
    });

    it('should throw if account not found', async () => {
      (dataSource.manager.findOne as jest.Mock)
        .mockResolvedValueOnce({ id: 1, provider: null, offers: [] }) // task
        .mockResolvedValueOnce(null); // account

      await expect(service.makeOffer(1, 1)).rejects.toThrow(HttpException);
    });

    it('should throw if account is not provider', async () => {
      (dataSource.manager.findOne as jest.Mock)
        .mockResolvedValueOnce({ id: 1, provider: null, offers: [] }) // task
        .mockResolvedValueOnce({ id: 1, role: 'USER' }); // account not provider

      await expect(service.makeOffer(1, 1)).rejects.toThrow(HttpException);
    });

    it('should throw if already offered', async () => {
      (dataSource.manager.findOne as jest.Mock)
        .mockResolvedValueOnce({ id: 1, provider: null, offers: [{ id: 1 }] }) // task
        .mockResolvedValueOnce({ id: 1, role: AccountRoles.PROVIDER }); // provider

      await expect(service.makeOffer(1, 1)).rejects.toThrow(HttpException);
    });

    it('should successfully make an offer', async () => {
      const task = { id: 1, provider: null, offers: [] };
      const account = { id: 2, role: AccountRoles.PROVIDER };

      (dataSource.manager.findOne as jest.Mock)
        .mockResolvedValueOnce(task) // task
        .mockResolvedValueOnce(account); // provider

      (dataSource.manager.save as jest.Mock).mockResolvedValueOnce({
        ...task,
        offers: [account],
      });

      const result = await service.makeOffer(2, 1);

      expect(result.offers).toContain(account);
      expect(dataSource.manager.save).toHaveBeenCalledWith(TaskEntity, {
        ...task,
        offers: [account],
      });
    });

    it('should successfully make an offer with task that has no offers before', async () => {
      const task = { id: 1, provider: null, offers: null };
      const account = { id: 2, role: AccountRoles.PROVIDER };

      (dataSource.manager.findOne as jest.Mock)
        .mockResolvedValueOnce(task) // task
        .mockResolvedValueOnce(account); // provider

      (dataSource.manager.save as jest.Mock).mockResolvedValueOnce({
        ...task,
        offers: [account],
      });

      const result = await service.makeOffer(2, 1);

      expect(result.offers).toContain(account);
      expect(dataSource.manager.save).toHaveBeenCalledWith(TaskEntity, {
        ...task,
        offers: [account],
      });
    });
  });

  describe('getOffersForAccount', () => {
    it('should throw if account not found', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getOffersForAccount(1)).rejects.toThrow(
        HttpException,
      );
    });

    it('should return offered tasks for provider', async () => {
      const account = {
        id: 1,
        role: AccountRoles.PROVIDER,
        tasksOffered: [
          {
            id: 1,
            name: 'Task 1',
            provider: null,
            user: {
              id: 3,
              email: 'user@example.com',
              individualAccount: {},
              companyAccount: null,
            },
          },
          { id: 2, name: 'Task 2', provider: { id: 99 } }, // already accepted, should exclude
        ],
      };

      (dataSource.manager.findOne as jest.Mock).mockResolvedValue(account);

      const result = await service.getOffersForAccount(1);

      expect(result).toEqual([
        {
          taskId: 1,
          taskName: 'Task 1',
          user: {
            id: 3,
            email: 'user@example.com',
            individualAccount: {},
            companyAccount: null,
          },
        },
      ]);
    });

    it('should return offered tasks for provider with no tasksOffered', async () => {
      const account = {
        id: 1,
        role: AccountRoles.PROVIDER,
        tasksOffered: null,
      };

      (dataSource.manager.findOne as jest.Mock).mockResolvedValue(account);

      const result = await service.getOffersForAccount(1);

      expect(result).toEqual([]);
    });

    it('should return posted tasks with offers for user', async () => {
      const account = {
        id: 2,
        role: AccountRoles.USER,
        tasksPosted: [
          {
            id: 10,
            name: 'Posted Task',
            provider: null,
            offers: [
              {
                id: 4,
                email: 'provider@example.com',
                individualAccount: {},
                companyAccount: null,
                skills: [],
              },
            ],
          },
        ],
      };

      (dataSource.manager.findOne as jest.Mock).mockResolvedValue(account);

      const result = await service.getOffersForAccount(2);

      expect(result).toEqual([
        {
          taskId: 10,
          taskName: 'Posted Task',
          offers: [
            {
              id: 4,
              email: 'provider@example.com',
              individualAccount: {},
              companyAccount: null,
              skills: [],
            },
          ],
        },
      ]);
    });

    it('should return posted tasks with offers for user with no taskOffers', async () => {
      const account = {
        id: 2,
        role: AccountRoles.USER,
        tasksPosted: [
          {
            id: 10,
            name: 'Posted Task',
            provider: null,
            offers: null,
          },
        ],
      };

      (dataSource.manager.findOne as jest.Mock).mockResolvedValue(account);

      const result = await service.getOffersForAccount(2);

      expect(result).toEqual([
        {
          taskId: 10,
          taskName: 'Posted Task',
          offers: [],
        },
      ]);
    });

    it('should return posted tasks with offers for user with no tasksPosted', async () => {
      const account = {
        id: 2,
        role: AccountRoles.USER,
        tasksPosted: null,
      };

      (dataSource.manager.findOne as jest.Mock).mockResolvedValue(account);

      const result = await service.getOffersForAccount(2);

      expect(result).toEqual([]);
    });
  });

  describe('acceptOffer', () => {
    const acceptOfferDto: AcceptOfferDto = {
      accountId: 1,
      providerId: 2,
      taskId: 3,
    };

    it('should throw if task not found', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.acceptOffer(acceptOfferDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw if not task owner', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValue({
        id: 3,
        user: { id: 999 }, // not matching user
      });

      await expect(service.acceptOffer(acceptOfferDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw if task already accepted', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValue({
        id: 3,
        user: { id: 1 },
        provider: { id: 999 },
      });

      await expect(service.acceptOffer(acceptOfferDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw if provider not found in offers', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValue({
        id: 3,
        user: { id: 1 },
        provider: null,
        offers: null,
      });

      await expect(service.acceptOffer(acceptOfferDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should accept an offer successfully', async () => {
      const task = {
        id: 3,
        user: { id: 1 },
        provider: null,
        offers: [{ id: 2 }],
      };

      (dataSource.manager.findOne as jest.Mock).mockResolvedValue(task);
      (dataSource.manager.save as jest.Mock).mockResolvedValue(task);

      const result = await service.acceptOffer(acceptOfferDto);

      expect(result).toEqual({ message: 'Offer accepted successfully!' });
    });
  });
});
