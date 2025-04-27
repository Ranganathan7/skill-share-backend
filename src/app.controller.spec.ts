import { AppController } from './app.controller';

// Mock the AppService class
class MockAppService {
  getAppName = jest.fn();
}

describe('AppController', () => {
  let appController: AppController;
  let mockAppService: MockAppService;

  beforeEach(() => {
    // Create a new instance of the mock AppService for each test
    mockAppService = new MockAppService();

    // Instantiate AppController with the mock AppService
    appController = new AppController(mockAppService as any);
  });

  describe('root', () => {
    it('should call appService.getAppName', () => {
      // Arrange
      const mockAppName = 'My Awesome App';
      mockAppService.getAppName.mockReturnValue(mockAppName);

      // Act
      appController.getAppName();

      // Assert
      expect(mockAppService.getAppName).toHaveBeenCalled();
    });

    it('should return the app name from appService', () => {
      // Arrange
      const mockAppName = 'My Fantastic App';
      mockAppService.getAppName.mockReturnValue(mockAppName);

      // Act
      const result = appController.getAppName();

      // Assert
      expect(result).toBe(mockAppName);
    });
  });
});