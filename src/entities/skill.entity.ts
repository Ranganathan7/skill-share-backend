import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { NatureOfWork, RateCurrency, SkillCategory } from "src/common/constants/constants";
import { AccountEntity } from "./account.entity";

@Entity({ name: 'skills' })
export class SkillEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SkillCategory, unique: true })
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