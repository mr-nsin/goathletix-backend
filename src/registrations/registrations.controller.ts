import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { RegistrationsService } from './registrations.service';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrations: RegistrationsService) {}

  /** Book tickets: creates the order, the participants, the tickets (each with its QR code) and the answers. Payment comes later. */
  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateRegistrationDto) {
    return this.registrations.create(dto);
  }
}
