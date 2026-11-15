import { InternalServerErrorException } from '@nestjs/common';
import { MeController } from './me.controller';
import type { SupabaseService } from '../supabase.service';

function build(result: { data: unknown; error: unknown }) {
  const maybeSingle = jest.fn().mockResolvedValue(result);
  const eq = jest.fn().mockReturnValue({ maybeSingle });
  const select = jest.fn().mockReturnValue({ eq });
  const from = jest.fn().mockReturnValue({ select });
  const controller = new MeController({
    client: { from },
  } as unknown as SupabaseService);
  return { controller, from, eq };
}

const user = { id: 'u1', email: 'a@b.co', phone: null };

describe('MeController', () => {
  it('returns the profile merged with email and phone', async () => {
    const { controller, from, eq } = build({
      data: { full_name: 'Asha', avatar_url: null, onboarding_completed: true },
      error: null,
    });
    await expect(controller.getMe(user)).resolves.toEqual({
      id: 'u1',
      email: 'a@b.co',
      phone: null,
      full_name: 'Asha',
      avatar_url: null,
      onboarding_completed: true,
    });
    expect(from).toHaveBeenCalledWith('profiles');
    expect(eq).toHaveBeenCalledWith('id', 'u1');
  });

  it('returns null profile fields when the row does not exist yet', async () => {
    const { controller } = build({ data: null, error: null });
    await expect(controller.getMe(user)).resolves.toMatchObject({
      id: 'u1',
      full_name: null,
      avatar_url: null,
      onboarding_completed: null,
    });
  });

  it('throws InternalServerError on a Supabase error', async () => {
    const { controller } = build({ data: null, error: { message: 'boom' } });
    await expect(controller.getMe(user)).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});
