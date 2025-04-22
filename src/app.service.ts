import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) { }

  getAppName(): string {
    return this.configService.get<string>('app.name') || "Config service not initialized properly!";
  }
}
