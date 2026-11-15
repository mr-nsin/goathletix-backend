import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { SupabaseService } from '../supabase.service';

export interface AuthUser {
  id: string;
  email: string | null;
  phone: string | null;
}

export type AuthenticatedRequest = Request & { user?: AuthUser };

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers?.authorization;
    const match =
      typeof header === 'string' ? /^Bearer\s+(\S+)$/i.exec(header) : null;
    if (!match) {
      throw new UnauthorizedException(
        'Missing or invalid authentication token',
      );
    }

    let user: { id: string; email?: string; phone?: string } | null = null;
    try {
      const { data, error } = await this.supabase.client.auth.getUser(match[1]);
      user = error ? null : data.user;
    } catch {
      user = null;
    }
    if (!user) {
      throw new UnauthorizedException(
        'Missing or invalid authentication token',
      );
    }

    request.user = {
      id: user.id,
      email: user.email || null,
      phone: user.phone || null,
    };
    return true;
  }
}
