import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AddUpdateSkillDto } from './dto/add-update-skill.dto';
import { SkillEntity } from 'src/entities/skill.entity';
import { AccountEntity } from 'src/entities/account.entity';
import { AccountRoles } from 'src/common/constants/constants';

@Injectable()
export class SkillService {
  constructor(private readonly dataSource: DataSource) { }

  async addOrUpdate(providerId: number, dto: AddUpdateSkillDto) {
    // Check if account id is valid
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

    // Only provider can add / update skill
    if (account.role !== AccountRoles.PROVIDER) {
      throw new HttpException(
        {
          errorCode: 'NotAProvider',
          description: 'Only provider can add / update skill',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // Check if the provider already has a skill in the same category
    const existingSkill = await this.dataSource.manager.findOne(SkillEntity, {
      where: { account: { id: providerId }, category: dto.category },
      relations: ['account'],
    });

    if (existingSkill) {
      // If skill already exists, update it with new details
      existingSkill.experience = dto.experience;
      existingSkill.natureOfWork = dto.natureOfWork;
      existingSkill.hourlyRate = dto.hourlyRate;
      existingSkill.rateCurrency = dto.rateCurrency;

      // Save the updated skill
      await this.dataSource.manager.save(SkillEntity, existingSkill);

      return {
        message: 'Updated existing skill!',
      };
    }

    // If skill does not exist, create a new one
    const newSkill = new SkillEntity();
    newSkill.account = account; // Associate the skill with the provider's account
    Object.assign(newSkill, dto);

    // Save the new skill
    await this.dataSource.manager.save(SkillEntity, newSkill);
    return {
      message: 'Added new skill!',
    };
  }

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
