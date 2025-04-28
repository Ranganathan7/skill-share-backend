import { SkillService } from './skill.service';
import { DataSource } from 'typeorm';
import { SkillEntity } from '../entities/skill.entity';
import { AddUpdateSkillDto } from './dto/add-update-skill.dto';
import { HttpException, NotFoundException } from '@nestjs/common';
import { AccountRoles, NatureOfWork, RateCurrency, SkillCategory } from '../common/constants/constants';

describe('SkillService', () => {
  let service: SkillService;
  let dataSource: DataSource;

  beforeEach(() => {
    dataSource = {
      manager: {
        findOne: jest.fn(),
        find: jest.fn(),
        save: jest.fn(),
      },
    } as any;
    service = new SkillService(dataSource);
  });

  describe('addOrUpdate', () => {
    const providerId = 1;
    const dto: AddUpdateSkillDto = {
      category: SkillCategory.BACKEND,
      experience: 5,
      natureOfWork: NatureOfWork.ONLINE,
      hourlyRate: 30,
      rateCurrency: RateCurrency.USD,
      accountId: 1
    };

    it('should throw AccountNotFound if account does not exist', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.addOrUpdate(providerId, dto)).rejects.toThrow(HttpException);
      expect(dataSource.manager.findOne).toHaveBeenCalled();
    });

    it('should throw NotAProvider if account is not a provider', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce({ role: AccountRoles.USER });

      await expect(service.addOrUpdate(providerId, dto)).rejects.toThrow(HttpException);
    });

    it('should update skill if existing skill found', async () => {
      const mockAccount = { id: providerId, role: AccountRoles.PROVIDER };
      const existingSkill = new SkillEntity();
      (dataSource.manager.findOne as jest.Mock)
        .mockResolvedValueOnce(mockAccount) // find account
        .mockResolvedValueOnce(existingSkill); // find existing skill

      const saveSpy = jest.spyOn(dataSource.manager, 'save').mockResolvedValueOnce(null);

      const result = await service.addOrUpdate(providerId, dto);

      expect(saveSpy).toHaveBeenCalledWith(SkillEntity, expect.objectContaining({
        experience: dto.experience,
        natureOfWork: dto.natureOfWork,
      }));
      expect(result).toEqual({ message: 'Updated existing skill!' });
    });

    it('should add new skill if no existing skill found', async () => {
      const mockAccount = { id: providerId, role: AccountRoles.PROVIDER };
      (dataSource.manager.findOne as jest.Mock)
        .mockResolvedValueOnce(mockAccount) // find account
        .mockResolvedValueOnce(null); // no existing skill

      const saveSpy = jest.spyOn(dataSource.manager, 'save').mockResolvedValueOnce(null);

      const result = await service.addOrUpdate(providerId, dto);

      expect(saveSpy).toHaveBeenCalledWith(SkillEntity, expect.any(SkillEntity));
      expect(result).toEqual({ message: 'Added new skill!' });
    });
  });

  describe('getSkills', () => {
    it('should throw NotFoundException if no skills found', async () => {
      (dataSource.manager.find as jest.Mock).mockResolvedValueOnce([]);

      await expect(service.getSkills(1)).rejects.toThrow(NotFoundException);
      expect(dataSource.manager.find).toHaveBeenCalled();
    });

    it('should return skills if found', async () => {
      const skills = [new SkillEntity()];
      (dataSource.manager.find as jest.Mock).mockResolvedValueOnce(skills);

      const result = await service.getSkills(1);

      expect(result).toEqual(skills);
      expect(dataSource.manager.find).toHaveBeenCalledWith(SkillEntity, {
        where: { account: { id: 1 } },
        relations: ['account'],
      });
    });
  });
});
