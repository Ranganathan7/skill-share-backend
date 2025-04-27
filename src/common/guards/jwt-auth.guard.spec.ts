import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { headers } from '../constants/constants';

// Mock JwtService
class MockJwtService {
  verify = jest.fn();
}

// Mock ConfigService
class MockConfigService {
  get = jest.fn();
}

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: MockJwtService;
  let configService: MockConfigService;
  let mockContext: ExecutionContext;
  const mockToken = 'valid.jwt.token';
  const mockAccountId = 'someAccountId';
  const mockSecret = 'super-secret-key';

  beforeEach(() => {
    jwtService = new MockJwtService();
    configService = new MockConfigService();
    guard = new JwtAuthGuard(jwtService as any, configService as any);

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
          body: {}, // Initialize body for accountId assignment
        }),
      }),
    } as any;

    configService.get.mockReturnValue(mockSecret);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if a valid Bearer token is provided', async () => {
      mockContext.switchToHttp().getRequest().headers[headers.authorization] = `Bearer ${mockToken}`;
      jwtService.verify.mockReturnValue({ accountId: mockAccountId });

      const canActivate = await guard.canActivate(mockContext);
      expect(canActivate).toBe(true);
      expect(jwtService.verify).toHaveBeenCalledWith(mockToken, { secret: mockSecret });
      expect(mockContext.switchToHttp().getRequest().body.accountId).toBe(mockAccountId);
    });

    it('should throw UnauthorizedException if Authorization header is missing', async () => {
      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
      try {
        await guard.canActivate(mockContext);
      } catch (error) {
        expect(error.response).toEqual({
          errorCode: 'MissingAuthorizationHeader',
          description: 'Authorization header missing or invalid',
        });
      }
    });

    it('should throw UnauthorizedException if Authorization header does not start with Bearer', async () => {
      mockContext.switchToHttp().getRequest().headers[headers.authorization] = `Basic ${mockToken}`;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
      try {
        await guard.canActivate(mockContext);
      } catch (error) {
        expect(error.response).toEqual({
          errorCode: 'MissingAuthorizationHeader',
          description: 'Authorization header missing or invalid',
        });
      }
    });

    it('should throw UnauthorizedException if the token is invalid', async () => {
      mockContext.switchToHttp().getRequest().headers[headers.authorization] = `Bearer ${mockToken}`;
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
      try {
        await guard.canActivate(mockContext);
      } catch (error) {
        expect(error.response).toEqual({
          errorCode: 'InvalidToken',
          description: 'Invalid or expired token',
        });
      }
    });

    it('should throw UnauthorizedException if the token verification fails for any reason', async () => {
      mockContext.switchToHttp().getRequest().headers[headers.authorization] = `Bearer ${mockToken}`;
      jwtService.verify.mockImplementation(() => {
        throw new Error('Some other error');
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
      try {
        await guard.canActivate(mockContext);
      } catch (error) {
        expect(error.response).toEqual({
          errorCode: 'InvalidToken',
          description: 'Invalid or expired token',
        });
      }
    });
  });
});