import {
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { CurrentUser } from './current-user.decorator';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import type { AuthUser } from './supabase-auth.guard';

interface ProfileRow {
  full_name: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean | null;
}

@Controller('me')
export class MeController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get()
  @UseGuards(SupabaseAuthGuard)
  async getMe(@CurrentUser() user: AuthUser) {
    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('full_name, avatar_url, onboarding_completed')
      .eq('id', user.id)
      .maybeSingle<ProfileRow>();
    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      full_name: data?.full_name ?? null,
      avatar_url: data?.avatar_url ?? null,
      onboarding_completed: data?.onboarding_completed ?? null,
    };
  }
}
