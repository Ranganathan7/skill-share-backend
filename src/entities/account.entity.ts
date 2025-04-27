import { AccountRoles, AccountType, fieldConfig } from "../common/constants/constants";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { TaskEntity } from "./task.entity";
import { SkillEntity } from "./skill.entity";

export class AddressEntity {
  @Column({ type: 'varchar', length: fieldConfig.streetNumber.length })
  streetNumber: string;

  @Column({ type: 'varchar', length: fieldConfig.streetName.length })
  streetName: string;

  @Column({ type: 'varchar', length: fieldConfig.city.length })
  city: string;

  @Column({ type: 'varchar', length: fieldConfig.state.length })
  state: string;

  @Column({ type: 'varchar', length: fieldConfig.postCode.length })
  postCode: string;
}

export class IndividualAccountEntity {
  @Column({ type: 'varchar', length: fieldConfig.name.length })
  firstName: string;

  @Column({ type: 'varchar', length: fieldConfig.name.length })
  lastName: string;

  @Column({ type: 'varchar', length: fieldConfig.mobileNumber.length })
  mobileNumber: string;

  @Column({ type: 'json' })
  address: AddressEntity;
}

export class CompanyAccountEntity {
  @Column({ type: 'varchar', length: fieldConfig.name.length })
  companyName: string;

  @Column({ type: 'varchar', length: fieldConfig.name.length })
  representativeFirstName: string;

  @Column({ type: 'varchar', length: fieldConfig.name.length })
  representativeLastName: string;

  @Column({ type: 'varchar', length: fieldConfig.phoneNumber.length })
  phoneNumber: string;

  @Column({ type: 'varchar', length: fieldConfig.businessTaxNumber.length })
  businessTaxNumber: string;

  @Column({ type: 'json', nullable: true })
  address?: AddressEntity;
}

@Entity({ name: 'accounts' })
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: fieldConfig.email.length })
  email: string;

  @Column({ type: 'varchar', length: fieldConfig.password.hashedLength })
  password: string;

  @Column({ type: 'enum', enum: AccountRoles })
  role: AccountRoles;

  @Column({ type: 'enum', enum: AccountType })
  type: AccountType;

  @Column({ type: 'json', nullable: true })
  individualAccount?: IndividualAccountEntity;

  @Column({ type: 'json', nullable: true })
  companyAccount?: CompanyAccountEntity;

  // Only for user
  @OneToMany(() => TaskEntity, (task) => task.user, { nullable: true })
  tasksPosted?: TaskEntity[];

  // Only for provider
  @OneToMany(() => TaskEntity, (task) => task.provider, { nullable: true })
  tasksWorkedOn?: TaskEntity[];

  // Only for provider
  @ManyToMany(() => TaskEntity, (task) => task.offers, { nullable: true })
  tasksOffered?: TaskEntity[]; // This could track tasks the provider has made offers for

  // Only for provider
  @OneToMany(() => SkillEntity, (skill) => skill.account, { nullable: true })
  skills?: SkillEntity[];
}
