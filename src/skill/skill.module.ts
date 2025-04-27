import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../entities/account.entity';
import { SkillEntity } from '../entities/skill.entity';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';

@Module({
  imports: [TypeOrmModule.forFeature([SkillEntity, AccountEntity])],
  controllers: [SkillController],
  providers: [SkillService],
})
export class SkillModule { }
