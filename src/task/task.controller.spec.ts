import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { UpdateTaskProgressDto } from './dto/update-progress.dto';
import { UpdateTaskStatusDto } from './dto/update-status.dto';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(() => {
    service = {
      createTask: jest.fn(),
      findTasksByAccount: jest.fn(),
      updateProgress: jest.fn(),
      updateStatus: jest.fn(),
    } as any;
    controller = new TaskController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('should call taskService.createTask with correct params', async () => {
      const dto = { title: 'New Task', description: 'Description' } as unknown as CreateTaskDto;
      const result = { id: 1, ...dto };
      (service.createTask as jest.Mock).mockResolvedValue(result);

      expect(await controller.createTask(dto)).toEqual(result);
      expect(service.createTask).toHaveBeenCalledWith(dto);
    });
  });

  describe('findTaskByAccount', () => {
    it('should call taskService.findTasksByAccount with correct params', async () => {
      const dto = { accountId: 1 } as GetTasksDto;
      const result = [{ id: 1, title: 'Task' }];
      (service.findTasksByAccount as jest.Mock).mockResolvedValue(result);

      expect(await controller.findTaskByAccount(dto)).toEqual(result);
      expect(service.findTasksByAccount).toHaveBeenCalledWith(dto.accountId);
    });
  });

  describe('updateProgress', () => {
    it('should call taskService.updateProgress with correct params', async () => {
      const dto = { taskId: 1, progress: 50 } as unknown as UpdateTaskProgressDto;
      const result = { success: true };
      (service.updateProgress as jest.Mock).mockResolvedValue(result);

      expect(await controller.updateProgress(dto)).toEqual(result);
      expect(service.updateProgress).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateStatus', () => {
    it('should call taskService.updateStatus with correct params', async () => {
      const dto = { taskId: 1, status: 'COMPLETED' } as unknown as UpdateTaskStatusDto;
      const result = { success: true };
      (service.updateStatus as jest.Mock).mockResolvedValue(result);

      expect(await controller.updateStatus(dto)).toEqual(result);
      expect(service.updateStatus).toHaveBeenCalledWith(dto);
    });
  });
});
