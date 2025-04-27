import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { headers } from '../constants/constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers[headers.authorization];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        errorCode: 'MissingAuthorizationHeader',
        description: 'Authorization header missing or invalid',
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token, { secret: this.configService.get<string>('jwt.secret') });
      request.body.accountId = payload.accountId;
      return true;
    } catch (err) {
      throw new UnauthorizedException({
        errorCode: 'InvalidToken',
        description: 'Invalid or expired token',
      });
    }
  }
}
