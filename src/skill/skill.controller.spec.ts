import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { AddUpdateSkillDto } from './dto/add-update-skill.dto';
import { GetSkillsDto } from './dto/get-skills.dto';

describe('SkillController', () => {
  let controller: SkillController;
  let service: SkillService;

  beforeEach(() => {
    service = {
      addOrUpdate: jest.fn(),
      getSkills: jest.fn(),
    } as any;
    controller = new SkillController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addOrUpdate', () => {
    it('should call skillService.addOrUpdate with correct params', async () => {
      const dto = { accountId: 1, skillName: 'NestJS' } as unknown as AddUpdateSkillDto;
      const result = { success: true };
      (service.addOrUpdate as jest.Mock).mockResolvedValue(result);

      expect(await controller.addOrUpdate(dto)).toEqual(result);
      expect(service.addOrUpdate).toHaveBeenCalledWith(dto.accountId, dto);
    });
  });

  describe('getSkills', () => {
    it('should call skillService.getSkills with correct params', async () => {
      const dto = { accountId: 1 } as GetSkillsDto;
      const result = [{ skillId: 1, name: 'NestJS' }];
      (service.getSkills as jest.Mock).mockResolvedValue(result);

      expect(await controller.getSkills(dto)).toEqual(result);
      expect(service.getSkills).toHaveBeenCalledWith(dto.accountId);
    });
  });
});
