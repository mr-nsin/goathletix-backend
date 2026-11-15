import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import type { SupabaseService } from '../supabase.service';

function build(getUser: jest.Mock) {
  const guard = new SupabaseAuthGuard({
    client: { auth: { getUser } },
  } as unknown as SupabaseService);
  const request: {
    headers: { authorization?: string };
    user?: unknown;
  } = { headers: {} };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  return { guard, request, context };
}

describe('SupabaseAuthGuard', () => {
  it('rejects a request without an Authorization header', async () => {
    const getUser = jest.fn();
    const { guard, context } = build(getUser);
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(getUser).not.toHaveBeenCalled();
  });

  it('rejects a non-Bearer scheme', async () => {
    const getUser = jest.fn();
    const { guard, request, context } = build(getUser);
    request.headers.authorization = 'Basic abc123';
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(getUser).not.toHaveBeenCalled();
  });

  it('rejects an invalid or expired token', async () => {
    const getUser = jest
      .fn()
      .mockResolvedValue({ data: { user: null }, error: { message: 'bad' } });
    const { guard, request, context } = build(getUser);
    request.headers.authorization = 'Bearer nope';
    await expect(guard.canActivate(context)).rejects.toThrow(
      'Missing or invalid authentication token',
    );
  });

  it('rejects when Supabase throws', async () => {
    const getUser = jest.fn().mockRejectedValue(new Error('network'));
    const { guard, request, context } = build(getUser);
    request.headers.authorization = 'Bearer tok';
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('accepts a good token and attaches the user', async () => {
    const getUser = jest.fn().mockResolvedValue({
      data: { user: { id: 'u1', email: 'a@b.co', phone: '' } },
      error: null,
    });
    const { guard, request, context } = build(getUser);
    request.headers.authorization = 'Bearer good-token';
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(getUser).toHaveBeenCalledWith('good-token');
    expect(request.user).toEqual({ id: 'u1', email: 'a@b.co', phone: null });
  });
});
