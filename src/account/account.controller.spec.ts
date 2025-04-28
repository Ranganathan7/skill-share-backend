import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { AuthAccountDto } from './dto/authenticate-account.dto';
import { GetAccountDto } from './dto/get-account.dto';

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      authenticate: jest.fn(),
      get: jest.fn(),
    } as any;
    controller = new AccountController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call accountService.create with the correct dto', async () => {
      const dto = {} as CreateAccountDto;
      const result = { success: true };
      (service.create as jest.Mock).mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('authenticate', () => {
    it('should call accountService.authenticate with the correct dto', async () => {
      const dto = {} as AuthAccountDto;
      const result = { accessToken: 'test-token' };
      (service.authenticate as jest.Mock).mockResolvedValue(result);

      expect(await controller.authenticate(dto)).toEqual(result);
      expect(service.authenticate).toHaveBeenCalledWith(dto);
    });
  });

  describe('get', () => {
    it('should call accountService.get with the correct dto', async () => {
      const dto = {} as GetAccountDto;
      const result = { account: { id: 1 } };
      (service.get as jest.Mock).mockResolvedValue(result);

      expect(await controller.get(dto)).toEqual(result);
      expect(service.get).toHaveBeenCalledWith(dto);
    });
  });
});
