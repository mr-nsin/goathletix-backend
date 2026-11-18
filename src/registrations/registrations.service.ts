import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import {
  ageOn,
  buildAnswers,
  isIsoDate,
  istToday,
  newQrToken,
  orderTotals,
  qrPayload,
  qrSvg,
  unitPrice,
  type CategoryRow,
  type FormFieldRow,
} from './registrations.logic';

interface EventRow {
  id: string;
  start_date: string | null;
  status: string;
  registration_opens_at: string | null;
  registration_closes_at: string | null;
  max_tickets_per_order: number;
  tax_mode: string | null;
  gst_rate: number | null;
  ticketing_mode: string;
}

export interface RegistrationResult {
  order_id: string;
  order_number: string;
  status: string;
  total_inr: number;
  repeat: boolean;
  tickets: {
    id: string;
    ticket_number: string;
    qr_payload: string;
    qr_svg: string;
  }[];
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Books tickets (POST /registrations). The server decides everything that matters and trusts nothing from the page but what the
 * buyer typed: it loads the event, its categories, price tiers and form fields; checks the registration window, the per-order limit,
 * each participant's age and gender against their category, and each answer against the organiser's questions; computes the prices
 * and totals itself; makes the QR tokens; then writes the whole booking in ONE database call (create_registration, migration 0027),
 * so a booking is either complete or absent, and the last seat can only go to one buyer.
 *
 * Payments are not live (ADR-007): the order is created `pending_payment` and its tickets `reserved`. When a payment provider is added,
 * a `payments` row (already in the schema) is linked to the order and the order and its tickets are marked paid and confirmed.
 */
@Injectable()
export class RegistrationsService {
  private readonly logger = new Logger(RegistrationsService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async create(dto: CreateRegistrationDto) {
    const client = this.supabase.client;
    if (!UUID_REGEX.test(dto.event_id))
      throw new NotFoundException('Event not found');

    // Same visibility rule as the event page: the service role bypasses RLS, so public + published is enforced here.
    const { data: ev, error: evErr } = await client
      .from('events')
      .select(
        'id, start_date, status, registration_opens_at, registration_closes_at, max_tickets_per_order, tax_mode, gst_rate, ticketing_mode',
      )
      .eq('id', dto.event_id)
      .eq('visibility', 'public')
      .eq('publication_status', 'published')
      .maybeSingle<EventRow>();
    if (evErr) this.fail('event', evErr);
    if (!ev) throw new NotFoundException('Event not found');
    if (ev.ticketing_mode !== 'platform')
      throw new UnprocessableEntityException(
        "This event sells tickets on the organiser's own site",
      );
    if (['completed', 'cancelled'].includes(ev.status))
      throw new UnprocessableEntityException(
        'Registration for this event is closed',
      );
    const now = new Date();
    if (ev.registration_opens_at && new Date(ev.registration_opens_at) > now)
      throw new UnprocessableEntityException('Registration has not opened yet');
    if (ev.registration_closes_at && new Date(ev.registration_closes_at) < now)
      throw new UnprocessableEntityException('Registration has closed');
    if (dto.seats.length > ev.max_tickets_per_order)
      throw new UnprocessableEntityException(
        `At most ${ev.max_tickets_per_order} tickets per order`,
      );

    const [cats, fields] = await Promise.all([
      client
        .from('event_categories')
        .select(
          'id, label, gender, capacity, slots_taken, price_inr, min_age, max_age, event_price_tiers(id, label, price_inr, valid_from, valid_until)',
        )
        .eq('event_id', ev.id)
        .returns<CategoryRow[]>(),
      client
        .from('event_form_fields')
        .select(
          'id, category_id, field_key, label, field_type, options, is_required',
        )
        .eq('event_id', ev.id)
        .order('sort_order')
        .returns<FormFieldRow[]>(),
    ]);
    if (cats.error) this.fail('categories', cats.error);
    if (fields.error) this.fail('form fields', fields.error);
    const byId = new Map((cats.data ?? []).map((c) => [c.id, c]));

    const today = istToday(now);
    const eventDay = ev.start_date ?? today;
    const problems: string[] = [];
    const prices: number[] = [];

    const tickets = dto.seats.map((seat, i) => {
      const who = `Participant ${i + 1}`;
      const cat = byId.get(seat.category_id);
      if (!cat) {
        problems.push(`${who}: that ticket category is not part of this event`);
        return null;
      }
      const price = unitPrice(cat, today);
      if (!price) {
        problems.push(`${who}: ${cat.label} is not on sale`);
        return null;
      }
      const p = seat.participant;
      if (!isIsoDate(p.birth_date) || p.birth_date >= today)
        problems.push(`${who}: enter a real date of birth`);
      else {
        const age = ageOn(p.birth_date, eventDay);
        if (
          (cat.min_age !== null && age < cat.min_age) ||
          (cat.max_age !== null && age > cat.max_age)
        )
          problems.push(`${who}: ${cat.label} is not open to age ${age}`);
      }
      if (
        (cat.gender === 'female' || cat.gender === 'male') &&
        p.gender !== cat.gender
      )
        problems.push(`${who}: ${cat.label} is for ${cat.gender} participants`);

      const answers = buildAnswers(
        fields.data ?? [],
        cat.id,
        seat.answers ?? {},
      );
      problems.push(...answers.errors.map((e) => `${who}: ${e}`));

      prices.push(price.price);
      const token = newQrToken();
      const payload = qrPayload(token);
      return {
        category_id: cat.id,
        price_tier_id: price.tierId,
        price_inr: price.price,
        qr_token: token,
        qr_payload: payload,
        qr_svg: qrSvg(payload),
        participant: {
          full_name: p.full_name.trim(),
          email: p.email?.trim() || null,
          phone: p.phone?.trim() || null,
          gender: p.gender,
          birth_date: p.birth_date,
        },
        answers: answers.rows,
      };
    });

    if (problems.length)
      throw new BadRequestException({
        message: 'Some details need fixing',
        problems,
      });

    const totals = orderTotals(prices, ev.tax_mode, ev.gst_rate);
    if (
      dto.expected_total_inr !== undefined &&
      dto.expected_total_inr !== totals.total_inr
    ) {
      throw new ConflictException({
        code: 'PRICE_CHANGED',
        message: 'The price changed since you opened checkout',
        total_inr: totals.total_inr,
      });
    }

    const rpc = await client.rpc('create_registration', {
      p: {
        event_id: ev.id,
        idempotency_key: dto.idempotency_key ?? null,
        buyer: {
          name: dto.buyer.name.trim(),
          email: dto.buyer.email.trim(),
          phone: dto.buyer.phone.trim(),
        },
        order: totals,
        tickets,
      },
    });
    if (rpc.error) {
      const error = rpc.error;
      const msg = error.message ?? '';
      if (msg.startsWith('SOLD_OUT:'))
        throw new ConflictException({
          code: 'SOLD_OUT',
          message: 'That category has sold out',
          category_id: msg.slice(9),
        });
      if (msg.startsWith('BAD_CATEGORY:'))
        throw new BadRequestException(
          'That ticket category is not part of this event',
        );
      this.fail('create_registration', error);
    }
    return rpc.data as RegistrationResult;
  }

  private fail(
    what: string,
    error: { message?: string; code?: string },
  ): never {
    this.logger.error(
      `registrations: ${what} failed: ${error.code ?? ''} ${error.message ?? ''}`,
    );
    throw new InternalServerErrorException(
      'Could not complete the registration',
    );
  }
}
