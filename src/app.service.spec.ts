import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

// Mock the ConfigService class
class MockConfigService {
  private config: Record<string, any>;

  constructor(initialConfig: Record<string, any> = {}) {
    this.config = initialConfig;
  }

  get<T>(key: string): T | undefined {
    const keys = key.split('.');
    let value: any = this.config;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }
    return value as T | undefined;
  }
}

describe('AppService', () => {
  let appService: AppService;
  let mockConfigService: MockConfigService;

  describe('getAppName', () => {
    it('should return the app name from config service when it exists', () => {
      // Arrange
      const expectedAppName = 'My Awesome Application';
      mockConfigService = new MockConfigService({
        app: { name: expectedAppName },
      });
      appService = new AppService(mockConfigService as any);

      // Act
      const appName = appService.getAppName();

      // Assert
      expect(appName).toBe(expectedAppName);
      expect(mockConfigService.get('app.name')).toBe(expectedAppName); // Verify config service was used
    });

    it('should return a default message when app.name is not configured', () => {
      // Arrange
      mockConfigService = new MockConfigService({});
      appService = new AppService(mockConfigService as any);

      // Act
      const appName = appService.getAppName();

      // Assert
      expect(appName).toBe('Config service not initialized properly!');
      expect(mockConfigService.get('app.name')).toBeUndefined(); // Verify config service returned undefined
    });

    it('should return a default message when the "app" section is not configured', () => {
      // Arrange
      mockConfigService = new MockConfigService({ other: 'value' });
      appService = new AppService(mockConfigService as any);

      // Act
      const appName = appService.getAppName();

      // Assert
      expect(appName).toBe('Config service not initialized properly!');
      expect(mockConfigService.get('app.name')).toBeUndefined(); // Verify config service returned undefined
    });
  });
});
