import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../entities/account.entity';
import { TaskEntity } from '../entities/task.entity';
import { SkillEntity } from '../entities/skill.entity';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, TaskEntity, SkillEntity])],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
