import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BeforeInsert, ManyToMany, JoinTable } from "typeorm";
import { fieldConfig, RateCurrency, SkillCategory, TaskStatus } from "../common/constants/constants";
import { AccountEntity } from "./account.entity";

export class ProgressEntity {
  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}

@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SkillCategory })
  category: SkillCategory;

  @Column({ type: 'varchar', length: fieldConfig.taskName.length })
  name: string;

  @Column({ type: 'varchar', length: fieldConfig.taskDescription.length })
  description: string;

  @Column({ type: 'timestamp' })
  expectedStartDate: Date;

  @Column({ type: 'double precision' })
  expectedWorkingHours: number;

  @Column({ type: 'double precision' })
  hourlyRate: number;

  @Column({ type: 'enum', enum: RateCurrency })
  rateCurrency: RateCurrency;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @ManyToMany(() => AccountEntity, (account) => account.tasksOffered, { nullable: true })
  @JoinTable() // This will create a join table between TaskEntity and AccountEntity
  offers?: AccountEntity[];

  // Progress field to store an array of progress descriptions with timestamps
  @Column({ type: 'json', default: [] })
  progress: Array<ProgressEntity>;

  @ManyToOne(() => AccountEntity, (account) => account.tasksWorkedOn, { nullable: true })
  provider?: AccountEntity;

  @ManyToOne(() => AccountEntity, (account) => account.tasksPosted)
  user: AccountEntity;
}
