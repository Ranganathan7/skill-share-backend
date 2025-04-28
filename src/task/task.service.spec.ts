import { TaskService } from './task.service';
import { DataSource } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { AccountRoles, RateCurrency, SkillCategory, TaskStatus } from '../common/constants/constants';
import { HttpException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateTaskProgressDto } from './dto/update-progress.dto';
import { UpdateTaskStatusDto } from './dto/update-status.dto';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TaskService', () => {
  let service: TaskService;
  let dataSource: DataSource;

  beforeEach(() => {
    dataSource = {
      manager: {
        findOne: jest.fn(),
        find: jest.fn(),
        save: jest.fn(),
      },
    } as any;
    service = new TaskService(dataSource);
  });

  describe('createTask', () => {
    const createTaskDto: CreateTaskDto = {
      accountId: 1,
      name: 'Test Task',
      expectedStartDate: new Date().toISOString(),
      category: SkillCategory.FRONTEND,
      description: '',
      expectedWorkingHours: 0,
      hourlyRate: 0,
      rateCurrency: RateCurrency.USD
    };

    it('should throw if start date is in the past', async () => {
      const pastDto = { ...createTaskDto, expectedStartDate: '2000-01-01T00:00:00Z' };
      await expect(service.createTask(pastDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw if account not found', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.createTask(createTaskDto)).rejects.toThrow(HttpException);
    });

    it('should throw if account is not a user', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce({ id: 1, role: AccountRoles.PROVIDER });
      await expect(service.createTask(createTaskDto)).rejects.toThrow(HttpException);
    });

    it('should create task successfully', async () => {
      const account = { id: 1, role: AccountRoles.USER };
      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce(account);
      (dataSource.manager.save as jest.Mock).mockResolvedValueOnce({});

      const result = await service.createTask(createTaskDto);

      expect(result).toEqual({ message: 'Task created successfully!' });
      expect(dataSource.manager.save).toHaveBeenCalledWith(TaskEntity, expect.objectContaining({
        status: TaskStatus.PENDING,
        user: account,
      }));
    });
  });

  describe('findTasksByAccount', () => {
    it('should throw if no tasks found', async () => {
      (dataSource.manager.find as jest.Mock).mockResolvedValue([]);

      await expect(service.findTasksByAccount(1)).rejects.toThrow(NotFoundException);
    });

    it('should return tasks if found', async () => {
      const tasks = [{ id: 1 }, { id: 2 }];
      (dataSource.manager.find as jest.Mock).mockResolvedValue(tasks);

      const result = await service.findTasksByAccount(1);
      expect(result).toEqual(tasks);
    });
  });

  describe('updateProgress', () => {
    const updateProgressDto: UpdateTaskProgressDto = {
      accountId: 2,
      taskId: 1,
      description: 'Progress update',
    };

    it('should throw if task not found', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.updateProgress(updateProgressDto)).rejects.toThrow(HttpException);
    });

    it('should throw if task not assigned to provider', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce({ id: 1, provider: { id: 99 } });

      await expect(service.updateProgress(updateProgressDto)).rejects.toThrow(HttpException);
    });

    it('should throw if task is already completed', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce({
        id: 1,
        provider: { id: 2 },
        status: TaskStatus.COMPLETED,
      });

      await expect(service.updateProgress(updateProgressDto)).rejects.toThrow(HttpException);
    });

    it('should update progress successfully', async () => {
      const task = {
        id: 1,
        provider: { id: 2 },
        status: TaskStatus.IN_PROGRESS,
        progress: [],
      };

      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce(task);
      (dataSource.manager.save as jest.Mock).mockResolvedValueOnce({});

      const result = await service.updateProgress(updateProgressDto);

      expect(result).toEqual({ message: 'Task progress updated successfully!' });
      expect(task.progress.length).toBe(1);
    });
  });

  describe('updateStatus', () => {
    const updateStatusDto: UpdateTaskStatusDto = {
      accountId: 1,
      taskId: 3,
    };

    it('should throw if task not found', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.updateStatus(updateStatusDto)).rejects.toThrow(HttpException);
    });

    it('should throw if user is not task creator', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce({
        id: 3,
        user: { id: 99 },
      });

      await expect(service.updateStatus(updateStatusDto)).rejects.toThrow(HttpException);
    });

    it('should throw if task already completed', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce({
        id: 3,
        user: { id: 1 },
        status: TaskStatus.COMPLETED,
      });

      await expect(service.updateStatus(updateStatusDto)).rejects.toThrow(HttpException);
    });

    it('should throw if task never started', async () => {
      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce({
        id: 3,
        user: { id: 1 },
        status: TaskStatus.PENDING,
      });

      await expect(service.updateStatus(updateStatusDto)).rejects.toThrow(HttpException);
    });

    it('should update task status to completed', async () => {
      const task = {
        id: 3,
        user: { id: 1 },
        status: TaskStatus.IN_PROGRESS,
      };

      (dataSource.manager.findOne as jest.Mock).mockResolvedValueOnce(task);
      (dataSource.manager.save as jest.Mock).mockResolvedValueOnce({});

      const result = await service.updateStatus(updateStatusDto);

      expect(result).toEqual({ message: 'Task status updated successfully!' });
      expect(task.status).toBe(TaskStatus.COMPLETED);
    });
  });
});
