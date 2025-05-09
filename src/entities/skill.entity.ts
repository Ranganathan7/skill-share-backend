import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import {
  NatureOfWork,
  RateCurrency,
  SkillCategory,
} from '../common/constants/constants';
import { AccountEntity } from './account.entity';

@Entity({ name: 'skills' })
@Unique(['account', 'category']) // A provider cant have duplicate skills
export class SkillEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SkillCategory })
  category: SkillCategory;

  @Column({ type: 'double precision' })
  experience: number;

  @Column({ type: 'enum', enum: NatureOfWork })
  natureOfWork: string;

  @Column({ type: 'double precision' })
  hourlyRate: number;

  @Column({ type: 'enum', enum: RateCurrency })
  rateCurrency: RateCurrency;

  @ManyToOne(() => AccountEntity, (account) => account.skills)
  account: AccountEntity;
}
