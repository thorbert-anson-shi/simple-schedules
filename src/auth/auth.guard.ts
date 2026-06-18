import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { Roles } from './auth.decorators';
import { Role } from '@src/db/types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const token = this.extractAuthTokenFromHeader(request);

    if (token === null) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractAuthTokenFromHeader(request: FastifyRequest): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roleList = this.reflector.getAllAndOverride<Role[] | undefined>(
      Roles,
      [context.getHandler(), context.getClass()],
    );

    if (!roleList) {
      return true;
    }

    const { user }: { user: { sub: number; role: Role } } = context
      .switchToHttp()
      .getRequest();

    return roleList.includes(user.role);
  }
}
