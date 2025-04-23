import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../entities/account.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, TaskEntity])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule { }
