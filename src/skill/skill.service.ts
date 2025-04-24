import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AddUpdateSkillDto } from './dto/add-update-skill.dto';
import { SkillEntity } from 'src/entities/skill.entity';
import { AccountEntity } from 'src/entities/account.entity';
import { AccountRoles } from 'src/common/constants/constants';

@Injectable()
export class SkillService {
  constructor(private readonly dataSource: DataSource) { }

  /**
   * Adds a new skill or updates an existing one for a provider account.
   * Validates the account existence and role before proceeding.
   * If a skill with the same category already exists, updates it.
   * Otherwise, creates a new skill entry for the provider.
   */
  async addOrUpdate(providerId: number, dto: AddUpdateSkillDto) {
    const account = await this.dataSource.manager.findOne(AccountEntity, {
      where: { id: providerId },
    });

    if (!account) {
      throw new HttpException(
        {
          errorCode: 'AccountNotFound',
          description: 'No account found with the provided ID',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (account.role !== AccountRoles.PROVIDER) {
      throw new HttpException(
        {
          errorCode: 'NotAProvider',
          description: 'Only provider can add / update skill',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const existingSkill = await this.dataSource.manager.findOne(SkillEntity, {
      where: { account: { id: providerId }, category: dto.category },
      relations: ['account'],
    });

    if (existingSkill) {
      existingSkill.experience = dto.experience;
      existingSkill.natureOfWork = dto.natureOfWork;
      existingSkill.hourlyRate = dto.hourlyRate;
      existingSkill.rateCurrency = dto.rateCurrency;

      await this.dataSource.manager.save(SkillEntity, existingSkill);

      return {
        message: 'Updated existing skill!',
      };
    }

    const newSkill = new SkillEntity();
    newSkill.account = account;
    Object.assign(newSkill, dto);

    await this.dataSource.manager.save(SkillEntity, newSkill);
    return {
      message: 'Added new skill!',
    };
  }

  /**
   * Retrieves all skills associated with the given account ID.
   * Returns an array of skill objects if found.
   */
  async getSkills(accountId: number): Promise<SkillEntity[]> {
    const skills = await this.dataSource.manager.find(SkillEntity, {
      where: { account: { id: accountId } },
      relations: ['account'],
    });

    if (skills.length === 0) {
      throw new NotFoundException({
        errorCode: 'NoSkillsFound',
        description: 'Invalid account ID or No skills found for the provided account ID',
      });
    }

    return skills;
  }
}
