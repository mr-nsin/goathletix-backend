import {
  EventsService,
  PriceTier,
  pickCurrentTierId,
  todayInIst,
} from './events.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

/**
 * A minimal, chainable stand-in for the Supabase PostgREST query builder. Every filter method
 * records its call and returns `this` so the fluent chain used by EventsService works
 * unmodified; the terminal `.range()` resolves the recorded `result`.
 */
class FakeQueryBuilder {
  calls: { method: string; args: unknown[] }[] = [];
  result: { data: unknown[]; count: number; error: unknown } = {
    data: [],
    count: 0,
    error: null,
  };

  single: unknown = null;

  private record(method: string, args: unknown[]) {
    this.calls.push({ method, args });
    return this;
  }

  select(...args: unknown[]) {
    return this.record('select', args);
  }
  or(...args: unknown[]) {
    return this.record('or', args);
  }
  eq(...args: unknown[]) {
    return this.record('eq', args);
  }
  in(...args: unknown[]) {
    return this.record('in', args);
  }
  ilike(...args: unknown[]) {
    return this.record('ilike', args);
  }
  lte(...args: unknown[]) {
    return this.record('lte', args);
  }
  gte(...args: unknown[]) {
    return this.record('gte', args);
  }
  overlaps(...args: unknown[]) {
    return this.record('overlaps', args);
  }
  textSearch(...args: unknown[]) {
    return this.record('textSearch', args);
  }
  order(...args: unknown[]) {
    this.record('order', args);
    return this;
  }
  maybeSingle() {
    this.calls.push({ method: 'maybeSingle', args: [] });
    return Promise.resolve({ data: this.single, error: null });
  }
  range(...args: unknown[]) {
    this.record('range', args);
    return Promise.resolve(this.result);
  }
  /** Awaiting the builder directly (no terminal call) resolves `result`, like PostgREST. */
  then<T>(resolve: (value: FakeQueryBuilder['result']) => T) {
    return Promise.resolve(this.result).then(resolve);
  }
}

function buildFakeSupabase(
  sportsRows: { slug: string; family: string }[] = [],
) {
  const eventsBuilder = new FakeQueryBuilder();
  const sportsBuilder = {
    select: () => Promise.resolve({ data: sportsRows, error: null }),
  };

  const client = {
    from: (table: string) => {
      if (table === 'sports') {
        return sportsBuilder;
      }
      return eventsBuilder;
    },
  };

  return { client, eventsBuilder } as unknown as {
    client: SupabaseService['client'];
    eventsBuilder: FakeQueryBuilder;
  };
}

describe('EventsService', () => {
  function makeService(sportsRows?: { slug: string; family: string }[]) {
    const { client, eventsBuilder } = buildFakeSupabase(sportsRows);
    const supabaseService = { client } as SupabaseService;
    const service = new EventsService(supabaseService);
    return { service, eventsBuilder };
  }

  it('filters by disciplines using .overlaps on discipline_slugs', async () => {
    const { service, eventsBuilder } = makeService();

    await service.findAll({
      disciplines: 'marathon,badminton',
    });

    const call = eventsBuilder.calls.find(
      (c) => c.method === 'overlaps' && c.args[0] === 'discipline_slugs',
    );
    expect(call).toBeDefined();
    expect(call?.args[1]).toEqual(['marathon', 'badminton']);
  });

  it('filters by ageCategories using .overlaps on age_categories', async () => {
    const { service, eventsBuilder } = makeService();

    await service.findAll({
      ageCategories: 'kids,junior',
    });

    const call = eventsBuilder.calls.find(
      (c) => c.method === 'overlaps' && c.args[0] === 'age_categories',
    );
    expect(call).toBeDefined();
    expect(call?.args[1]).toEqual(['kids', 'junior']);
  });

  it('prefix-matches every token so search works while the user types', async () => {
    const { service, eventsBuilder } = makeService();

    await service.findAll({ search: 'marathon club' });

    const call = eventsBuilder.calls.find((c) => c.method === 'textSearch');
    expect(call).toBeDefined();
    expect(call?.args[0]).toBe('search_vector');
    // `:*` on every token, AND'd. Without the prefix operator a partial word like "Mumb"
    // matches nothing, and the directory queries on every keystroke — so the box reads as
    // broken until a whole word is typed. No `type` means the plain `fts` operator, which
    // is the only one that accepts `:*`.
    expect(call?.args[1]).toBe('marathon:* & club:*');
    expect(call?.args[2]).toEqual({ config: 'simple' });

    // The old ilike-based .or() search must be gone.
    const orCall = eventsBuilder.calls.find((c) => c.method === 'or');
    expect(orCall).toBeUndefined();
  });

  it('strips tsquery operators from user input', async () => {
    const { service, eventsBuilder } = makeService();

    await service.findAll({ search: "run & !(club) | 'x'" });

    const call = eventsBuilder.calls.find((c) => c.method === 'textSearch');
    expect(call?.args[1]).toBe('run:* & club:* & x:*');
  });

  it('resolves family to sport slugs and filters sport_type with .in', async () => {
    const { service, eventsBuilder } = makeService([
      { slug: 'running', family: 'endurance' },
      { slug: 'cycling', family: 'endurance' },
      { slug: 'racquet_sport', family: 'racquet' },
    ]);

    await service.findAll({ family: 'endurance' });

    const call = eventsBuilder.calls.find(
      (c) => c.method === 'in' && c.args[0] === 'sport_type',
    );
    expect(call).toBeDefined();
    expect(call?.args[1]).toEqual(['running', 'cycling']);
  });

  const VISIBILITY_ID = '123e4567-e89b-42d3-a456-426614174000';

  function eqCalls(builder: FakeQueryBuilder) {
    return builder.calls
      .filter((c) => c.method === 'eq')
      .map((c) => [c.args[0], c.args[1]]);
  }

  it('list restricts to public + published on the same builder as the exact count', async () => {
    const { service, eventsBuilder } = makeService();

    await service.findAll({});

    expect(eqCalls(eventsBuilder)).toEqual(
      expect.arrayContaining([
        ['visibility', 'public'],
        ['publication_status', 'published'],
      ]),
    );
    // Filters must precede .range() and live on the builder created with count: 'exact'.
    const names = eventsBuilder.calls.map((c) => c.method);
    expect(eventsBuilder.calls[0]).toEqual({
      method: 'select',
      args: [expect.any(String), { count: 'exact' }],
    });
    expect(names.indexOf('eq')).toBeLessThan(names.indexOf('range'));
  });

  it('list keeps the visibility filters alongside user filters', async () => {
    const { service, eventsBuilder } = makeService();

    await service.findAll({ sport: 'running' });

    expect(eqCalls(eventsBuilder)).toEqual(
      expect.arrayContaining([
        ['visibility', 'public'],
        ['publication_status', 'published'],
        ['sport_type', 'running'],
      ]),
    );
  });

  it('findOne filters by public + published and returns the row', async () => {
    const { service, eventsBuilder } = makeService();
    eventsBuilder.single = { id: VISIBILITY_ID };

    await expect(service.findOne(VISIBILITY_ID)).resolves.toEqual({
      id: VISIBILITY_ID,
    });
    expect(eqCalls(eventsBuilder)).toEqual(
      expect.arrayContaining([
        ['id', VISIBILITY_ID],
        ['visibility', 'public'],
        ['publication_status', 'published'],
      ]),
    );
  });

  it('findOne throws NotFoundException when no public published row matches', async () => {
    const { service } = makeService();

    await expect(service.findOne(VISIBILITY_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

describe('EventsService.findDetails', () => {
  const EVENT_ID = '123e4567-e89b-42d3-a456-426614174000';

  type TableResult = { data: unknown[] | null; error: unknown };

  function makeDetailsService(
    eventRow: unknown,
    tables: Record<string, TableResult> = {},
  ) {
    const builders = new Map<string, FakeQueryBuilder>();
    const client = {
      from: (table: string) => {
        const builder = new FakeQueryBuilder();
        if (table === 'events') {
          builder.single = eventRow;
        } else {
          const r = tables[table] ?? { data: [], error: null };
          builder.result = {
            data: r.data as unknown[],
            count: 0,
            error: r.error,
          };
        }
        builders.set(table, builder);
        return builder;
      },
    } as unknown as SupabaseService['client'];
    const service = new EventsService({ client });
    return { service, builders };
  }

  function eqPairs(builder: FakeQueryBuilder | undefined) {
    return (builder?.calls ?? [])
      .filter((c) => c.method === 'eq')
      .map((c) => [c.args[0], c.args[1]]);
  }

  const EVENT_ROW = {
    id: EVENT_ID,
    event_name: 'Hill Run',
    ticketing_mode: 'external',
    organizer: { id: 'org-1', name: 'Org', instagram_url: null },
  };

  afterEach(() => {
    jest.useRealTimers();
  });

  it('404s on a non-UUID id without querying', async () => {
    const { service, builders } = makeDetailsService(EVENT_ROW);

    await expect(service.findDetails('not-a-uuid')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(builders.size).toBe(0);
  });

  it('404s when no public + published event matches and reads no child tables', async () => {
    const { service, builders } = makeDetailsService(null);

    await expect(service.findDetails(EVENT_ID)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(eqPairs(builders.get('events'))).toEqual(
      expect.arrayContaining([
        ['id', EVENT_ID],
        ['visibility', 'public'],
        ['publication_status', 'published'],
      ]),
    );
    expect([...builders.keys()]).toEqual(['events']);
  });

  it('returns empty arrays (never null) and splits the organizer out of the event', async () => {
    const { service } = makeDetailsService(EVENT_ROW, {
      event_categories: { data: null, error: null },
    });

    const { data } = await service.findDetails(EVENT_ID);

    expect(data.ticket_types).toEqual([]);
    expect(data.media).toEqual([]);
    expect(data.faqs).toEqual([]);
    expect(data.schedule).toEqual([]);
    expect(data.sponsors).toEqual([]);
    expect(data.organizer).toEqual(EVENT_ROW.organizer);
    expect(data.event).toEqual({
      id: EVENT_ID,
      event_name: 'Hill Run',
      ticketing_mode: 'external',
    });
  });

  it('returns organizer null when the event has none', async () => {
    const { service } = makeDetailsService({ id: EVENT_ID, organizer: null });

    const { data } = await service.findDetails(EVENT_ID);

    expect(data.organizer).toBeNull();
  });

  it('excludes hidden ticket types and keeps only published media in the query', async () => {
    const { service, builders } = makeDetailsService(EVENT_ROW);

    await service.findDetails(EVENT_ID);

    expect(eqPairs(builders.get('event_categories'))).toEqual([
      ['event_id', EVENT_ID],
      ['is_hidden', false],
    ]);
    expect(eqPairs(builders.get('event_media'))).toEqual([
      ['event_id', EVENT_ID],
      ['status', 'published'],
    ]);
  });

  it('orders ticket types and tiers, and picks the tier valid today in IST', async () => {
    // 2026-10-31T20:00Z is already 1 Nov in India (UTC+5:30).
    jest.useFakeTimers({ now: new Date('2026-10-31T20:00:00Z') });
    const { service } = makeDetailsService(EVENT_ROW, {
      event_categories: {
        data: [
          {
            id: 'c-10k',
            label: '10K',
            sort_order: 1,
            event_price_tiers: [
              {
                id: 't-late',
                label: 'Late',
                price_inr: 1500,
                valid_from: '2026-11-15',
                valid_until: null,
              },
              {
                id: 't-reg',
                label: 'Regular',
                price_inr: 1200,
                valid_from: '2026-11-01',
                valid_until: '2026-11-14',
              },
              {
                id: 't-early',
                label: 'Early bird',
                price_inr: 900,
                valid_from: null,
                valid_until: '2026-10-31',
              },
            ],
          },
          { id: 'c-hm', label: 'Half', sort_order: 0, event_price_tiers: [] },
          { id: 'c-5k', label: '5K', sort_order: 1, event_price_tiers: null },
        ],
        error: null,
      },
    });

    const { data } = await service.findDetails(EVENT_ID);

    expect(data.ticket_types.map((t) => t.id)).toEqual([
      'c-hm',
      'c-10k',
      'c-5k',
    ]);
    const tenK = data.ticket_types[1];
    expect(tenK.tiers.map((t) => t.id)).toEqual(['t-early', 't-reg', 't-late']);
    expect(tenK.current_tier_id).toBe('t-reg');
    expect(tenK).not.toHaveProperty('event_price_tiers');
    expect(data.ticket_types[0].tiers).toEqual([]);
    expect(data.ticket_types[0].current_tier_id).toBeNull();
    expect(data.ticket_types[2].tiers).toEqual([]);
  });

  it('orders media cover first, then newest edition', async () => {
    const media = (
      id: string,
      is_cover: boolean,
      edition_year: number | null,
    ) => ({
      id,
      url: `https://x/${id}.jpg`,
      kind: 'photo',
      caption: null,
      credit: null,
      edition_year,
      is_cover,
      created_at: '2026-01-01T00:00:00Z',
    });
    const { service } = makeDetailsService(EVENT_ROW, {
      event_media: {
        data: [
          media('m-2023', false, 2023),
          media('m-none', false, null),
          media('m-2025', false, 2025),
          media('m-cover', true, 2024),
        ],
        error: null,
      },
    });

    const { data } = await service.findDetails(EVENT_ID);

    expect(data.media.map((m) => m.id)).toEqual([
      'm-cover',
      'm-2025',
      'm-2023',
      'm-none',
    ]);
    expect(data.media[0]).not.toHaveProperty('created_at');
  });

  it('maps faqs and schedule to contract keys in order', async () => {
    const { service } = makeDetailsService(EVENT_ROW, {
      event_faqs: {
        data: [
          { question: 'B?', answer: 'b', sort_order: 2, created_at: null },
          { question: 'A?', answer: 'a', sort_order: 1, created_at: null },
        ],
        error: null,
      },
      event_schedule_items: {
        data: [
          {
            title: 'Flag off',
            starts_at: '2026-11-02T00:30:00+00:00',
            ends_at: null,
            notes: null,
            sort_order: 0,
          },
          {
            title: 'Expo',
            starts_at: '2026-11-01T04:30:00+00:00',
            ends_at: '2026-11-01T12:30:00+00:00',
            notes: 'Bring ID',
            sort_order: 0,
          },
        ],
        error: null,
      },
    });

    const { data } = await service.findDetails(EVENT_ID);

    expect(data.faqs).toEqual([
      { question: 'A?', answer: 'a' },
      { question: 'B?', answer: 'b' },
    ]);
    expect(data.schedule).toEqual([
      {
        title: 'Expo',
        starts_at: '2026-11-01T04:30:00+00:00',
        ends_at: '2026-11-01T12:30:00+00:00',
        notes: 'Bring ID',
      },
      {
        title: 'Flag off',
        starts_at: '2026-11-02T00:30:00+00:00',
        ends_at: null,
        notes: null,
      },
    ]);
  });

  function selectOf(builder: FakeQueryBuilder | undefined): string {
    const call = builder?.calls.find((c) => c.method === 'select');
    const select = call?.args[0];
    return typeof select === 'string' ? select : '';
  }

  function topLevelColumns(select: string): string[] {
    // Drop embedded resources such as organizer:organizers(...) before splitting.
    return select
      .replace(/[\w:]+\([^)]*\)/g, '')
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
  }

  it('selects the GA-048 event and ticket-type columns', async () => {
    const { service, builders } = makeDetailsService(EVENT_ROW);

    await service.findDetails(EVENT_ID);

    const eventColumns = topLevelColumns(selectOf(builders.get('events')));
    expect(eventColumns).toEqual(
      expect.arrayContaining([
        'tagline',
        'start_time',
        'end_time',
        'reporting_time',
        'is_certified',
        'certifying_body',
        'is_chip_timed',
        'timing_partner',
        'altitude_m',
        'course_map_url',
        'aid_stations',
        'amenities',
        'safety_info',
        'address_line',
        'pincode',
        'venue_notes',
        'refund_policy',
        'transfer_policy',
        'deferral_policy',
        'cancellation_policy',
        'terms_text',
        'waiver_text',
        'tax_mode',
        'gst_rate',
        'waitlist_enabled',
        'contact_email',
        'contact_phone',
        'whatsapp_url',
        'bib_expo_opens_at',
        'bib_expo_closes_at',
        'certificate_available_at',
        'results_url',
        'rating_avg',
        'rating_count',
      ]),
    );
    // No duplicate column names, which PostgREST would reject.
    expect(new Set(eventColumns).size).toBe(eventColumns.length);

    const ticketColumns = topLevelColumns(
      selectOf(builders.get('event_categories')),
    );
    expect(ticketColumns).toEqual(
      expect.arrayContaining([
        'description',
        'includes',
        'sales_start_at',
        'sales_end_at',
        'max_per_order',
        'min_age',
        'max_age',
        'age_as_on_date',
        'required_documents',
        'qualifying_standard',
        'team_size_min',
        'team_size_max',
        'eligibility_notes',
      ]),
    );
    expect(new Set(ticketColumns).size).toBe(ticketColumns.length);
    expect(eqPairs(builders.get('event_sponsors'))).toEqual([
      ['event_id', EVENT_ID],
    ]);
  });

  it('passes the new event and ticket-type fields through unchanged', async () => {
    const eventRow = {
      ...EVENT_ROW,
      tagline: 'Run the ghats',
      refund_policy: 'No refunds after 1 Nov',
      amenities: ['parking', 'medical'],
      aid_stations: [{ km: 5, offers: ['water'] }],
      gst_rate: 18,
      waitlist_enabled: true,
      bib_expo_opens_at: '2026-11-01T04:30:00+00:00',
      rating_avg: 4.5,
    };
    const { service } = makeDetailsService(eventRow, {
      event_categories: {
        data: [
          {
            id: 'c-10k',
            label: '10K',
            sort_order: 0,
            includes: ['T-shirt', 'Medal'],
            min_age: 18,
            max_age: null,
            age_as_on_date: '2026-11-02',
            required_documents: ['medical_certificate'],
            team_size_min: null,
            eligibility_notes: 'Open to all',
            event_price_tiers: [],
          },
        ],
        error: null,
      },
    });

    const { data } = await service.findDetails(EVENT_ID);

    const { organizer: _organizer, ...expectedEvent } = eventRow;
    void _organizer;
    expect(data.event).toEqual(expectedEvent);
    expect(data.ticket_types[0]).toMatchObject({
      includes: ['T-shirt', 'Medal'],
      min_age: 18,
      max_age: null,
      age_as_on_date: '2026-11-02',
      required_documents: ['medical_certificate'],
      team_size_min: null,
      eligibility_notes: 'Open to all',
    });
  });

  it('orders sponsors by sort_order, then tier, and maps to contract keys', async () => {
    const sponsor = (
      name: string,
      tier: string,
      sort_order: number,
      created_at = '2026-01-01T00:00:00Z',
    ) => ({
      name,
      tier,
      logo_url: `https://x/${name}.png`,
      website_url: null,
      sort_order,
      created_at,
    });
    const { service } = makeDetailsService(EVENT_ROW, {
      event_sponsors: {
        data: [
          sponsor('Media Co', 'media', 0),
          sponsor('Late Partner', 'partner', 1, '2026-02-01T00:00:00Z'),
          sponsor('Title Co', 'title', 0),
          sponsor('Early Partner', 'partner', 1, '2026-01-15T00:00:00Z'),
          sponsor('Gold Co', 'gold', 0),
        ],
        error: null,
      },
    });

    const { data } = await service.findDetails(EVENT_ID);

    expect(data.sponsors.map((s) => s.name)).toEqual([
      'Title Co',
      'Gold Co',
      'Media Co',
      'Early Partner',
      'Late Partner',
    ]);
    expect(data.sponsors[0]).toEqual({
      name: 'Title Co',
      tier: 'title',
      logo_url: 'https://x/Title Co.png',
      website_url: null,
    });
  });

  it('treats an absent sponsors table as [] but fails on a sponsors query error', async () => {
    const missing = makeDetailsService(EVENT_ROW, {
      event_sponsors: { data: null, error: { code: '42P01', message: 'x' } },
    });
    await expect(missing.service.findDetails(EVENT_ID)).resolves.toMatchObject({
      data: { sponsors: [] },
    });

    const broken = makeDetailsService(EVENT_ROW, {
      event_sponsors: { data: null, error: { code: '500', message: 'boom' } },
    });
    jest
      .spyOn(
        (broken.service as unknown as { logger: { error: () => void } }).logger,
        'error',
      )
      .mockImplementation(() => undefined);
    await expect(broken.service.findDetails(EVENT_ID)).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });

  it('treats an absent faq table as [] but fails on a ticket query error', async () => {
    const missing = makeDetailsService(EVENT_ROW, {
      event_faqs: { data: null, error: { code: 'PGRST205', message: 'x' } },
    });
    await expect(missing.service.findDetails(EVENT_ID)).resolves.toMatchObject({
      data: { faqs: [] },
    });

    const broken = makeDetailsService(EVENT_ROW, {
      event_categories: { data: null, error: { code: '500', message: 'boom' } },
    });
    jest
      .spyOn(
        (broken.service as unknown as { logger: { error: () => void } }).logger,
        'error',
      )
      .mockImplementation(() => undefined);
    await expect(broken.service.findDetails(EVENT_ID)).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});

describe('pickCurrentTierId', () => {
  const tier = (
    id: string,
    valid_from: string | null,
    valid_until: string | null,
  ): PriceTier => ({ id, label: id, price_inr: 0, valid_from, valid_until });

  it('returns null when no tier covers today', () => {
    expect(
      pickCurrentTierId([tier('a', '2026-12-01', null)], '2026-11-01'),
    ).toBeNull();
    expect(pickCurrentTierId([], '2026-11-01')).toBeNull();
  });

  it('includes both boundary dates', () => {
    const tiers = [tier('a', '2026-11-01', '2026-11-10')];
    expect(pickCurrentTierId(tiers, '2026-11-01')).toBe('a');
    expect(pickCurrentTierId(tiers, '2026-11-10')).toBe('a');
  });

  it('prefers a dated early bird over an undated regular tier', () => {
    const tiers = [
      tier('regular', null, null),
      tier('early', null, '2026-11-10'),
    ];
    expect(pickCurrentTierId(tiers, '2026-11-05')).toBe('early');
    expect(pickCurrentTierId(tiers, '2026-11-11')).toBe('regular');
  });
});

describe('todayInIst', () => {
  it('formats the Asia/Kolkata calendar date', () => {
    expect(todayInIst(new Date('2026-10-31T18:29:00Z'))).toBe('2026-10-31');
    expect(todayInIst(new Date('2026-10-31T18:30:00Z'))).toBe('2026-11-01');
  });
});
